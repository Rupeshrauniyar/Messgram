import {useState, useRef, useEffect, useContext} from "react";
import {Mic, Video, VideoIcon, ArrowLeft, User, Lock, PhoneOff} from "lucide-react";
import {UserContext} from "../context/UserContext";
import {io} from "socket.io-client";
import {Link, useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
const BACKENDURL = import.meta.env.VITE_BACKEND;
const socket = io(BACKENDURL);
import Cookies from "js-cookie";
import outgoing from "/src/assets/outgoing.mp3";
import incoming from "/src/assets/incoming.mp3";

const Call = () => {
  const navigate = useNavigate();
  // const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideo, setIsVideo] = useState(true);
  const [isAudio, setIsAudio] = useState(true);
  const {user, offer, setOffer} = useContext(UserContext);
  const myStreamRef = useRef(null);
  const frndsStreamRef = useRef(null);
  const params = useParams();
  const location = useLocation();
  const chatId = params.chatId;
  const receiverId = params.receiverId;
  const peer = new RTCPeerConnection({
    iceServers: [{urls: "stun:stun.l.google.com:19302"}],
  });
  const ringAudio = new Audio(outgoing);
  const incomingRingAudio = new Audio(incoming);

  const streamRef = useRef(null);
  const ringAudioRef = useRef(null);

  const initiateCall = async () => {
    try {
      const offer = await peer.createOffer();
      // ringAudio.play();
      ringAudioRef.current = setInterval(() => {
        // ringAudio.play();
      }, 5000);

      await peer.setLocalDescription(offer);
      const Data = {
        chatId,
        receiverId,
        offer,
        user,
      };
      socket.emit("initiate-call", Data);
    } catch (err) {
      navigate(-1);
    }
  };
  const initiateReceiver = async () => {
    try {
      incomingRingAudio.pause();
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      const Data = {
        chatId,
        answer,
      };
      socket.emit("receive-call", Data);
    } catch (err) {
      navigate(-1);
    }
    // console.log(offer);
  };
  const getStream = async () => {
    try {
      await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          streamRef.current = stream;
          stream.getTracks().forEach((track) => {
            peer.addTrack(track, stream);
          });
          myStreamRef.current.srcObject = stream;
          if (location.search === "?initiator=true") {
            initiateCall();
          } else {
            initiateReceiver();
          }
          // frndsStreamRef.current.srcObject = stream;
        });
    } catch (err) {
      navigate(-1);
    }
  };
  const handleCallEndInitiator = () => {
    try {
      clearInterval(ringAudioRef.current);
      ringAudio.pause();
      ringAudio.currentTime = 0;
      peer.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
      const Data = {
        chatId,
        receiverId: params.receiverId,
      };
      socket.emit("close-call", Data);
      navigate("/");
    } catch (err) {
      navigate(-1);
    }
  };
  const handleCallEndReceiver = () => {
    try {
      peer.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
      navigate(-1);
    } catch (err) {
      navigate(-1);
    }
  };

  useEffect(() => {
    getStream();

    peer.onicecandidate = async (event) => {
      if (event.candidate) {
        const Data = {
          chatId,
          candidate: event.candidate,
        };
        socket.emit("new-candidate", Data);
        // console.log("success");
      } else {
        // console.log("failed");
      }
    };

    peer.ontrack = async (event) => {
      if (event.streams[0]) {
        frndsStreamRef.current.srcObject = event.streams[0];
      }
    };
    socket.on("join-callees", async (answer) => {
      ringAudio.pause();
      await peer.setRemoteDescription(answer);
      // console.log(answer);
      clearInterval(ringAudioRef.current);
      ringAudio.pause();
      ringAudio.currentTime = 0;
    });
    socket.on("new-candidate", async (candidate) => {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
      // console.log("new-candidate");
    });
    socket.on("close-call", () => {
      handleCallEndReceiver();
      // ringAudio.play();
    });
    return () => {
      socket.off("join-callees");
      socket.off("new-candidate");
      socket.off("close-call");
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black  text-white ">
      <video
        autoPlay
        playsInline
        ref={frndsStreamRef}
        className="w-full h-full rounded-4xl scale-x-[-1] absolute  "
      />
      <div className="fixed MyStream w-[20%] h-[10%] z-20  right-0 bottom-38">
        <video
          autoPlay
          muted
          playsInline
          ref={myStreamRef}
          className=" scale-x-[-1] p-2 rounded-2xl"
        />
      </div>

      <div className="fixed bottom-0 bg-zinc-800 w-full h-15 rounded-t-md flex items-center justify-center p-4">
        <button></button>
        <button
          className="bg-red-500 p-3 rounded-full"
          onClick={() => handleCallEndInitiator()}>
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default Call;
