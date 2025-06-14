import {useState, useRef, useEffect, useContext} from "react";
import {Mic, Video, VideoIcon, ArrowLeft, User, Lock, PhoneOff, ScreenShare} from "lucide-react";
import {UserContext} from "../context/UserContext";
import {io} from "socket.io-client";
import {Link, useNavigate, useParams, useLocation} from "react-router-dom";
const BACKENDURL = import.meta.env.VITE_BACKEND;
const socket = io(BACKENDURL);
import outgoing from "/src/assets/outgoing.mp3";
import axios from "axios";
import Cookies from "js-cookie";

const Call = () => {
  const token = Cookies.get("token");

  const navigate = useNavigate();
  // const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isVideo, setIsVideo] = useState(true);
  const [isAudio, setIsAudio] = useState(true);
  const [isScreenShare, setScreenShare] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [calleeUser, setCalleeUser] = useState({});
  const {user, offer, caller} = useContext(UserContext);
  const myStreamRef = useRef(null);
  const frndsStreamRef = useRef(null);
  const params = useParams();
  const location = useLocation();
  const chatId = params.chatId;
  const receiverId = params.receiverId;
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:bn-turn2.xirsys.com"],
      },
      {
        username: "Wp4SeP3STfuzgmhrc7ctoqDkgIDVDWqHBh3INHsrb5fc5OWGdMvR9V1qn8fT0MMEAAAAAGhFF0dydXBlc2ho",
        credential: "84349dea-4424-11f0-bb6d-0242ac140004",
        urls: [
          "turn:bn-turn2.xirsys.com:80?transport=udp",
          "turn:bn-turn2.xirsys.com:3478?transport=udp",
          "turn:bn-turn2.xirsys.com:80?transport=tcp",
          "turn:bn-turn2.xirsys.com:3478?transport=tcp",
          "turns:bn-turn2.xirsys.com:443?transport=tcp",
          "turns:bn-turn2.xirsys.com:5349?transport=tcp",
        ],
      },
    ],
  });
  const ringAudio = new Audio(outgoing);
  // const incomingRingAudio = new Audio(incoming);

  const streamRef = useRef(null);
  // const ringAudioRef = useRef(null);
  const handleCallEndInitiator = () => {
    try {
      // clearInterval(ringAudioRef.current);
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
      navigate(-1);
    } catch (err) {
      navigate(-1);
    }
  };
  const handleCallEndReceiver = () => {
    try {
      ringAudio.pause();
      ringAudio.currentTime = 0;
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
  const initiateCall = async () => {
    try {
      const offer = await peer.createOffer();
      ringAudio.play();

      await peer.setLocalDescription(offer);
      const Data = {
        chatId,
        receiverId,
        offer,
        user,
      };
      socket.emit("initiate-call", Data);
      const response = await axios.post(
        `${BACKENDURL}/api/search-users`,

        {receiverId},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers for authenticated requests
          },
        }
      );
      if (response.data) {
        setCalleeUser(response.data.user);
      }
    } catch (err) {
      navigate(-1);
    }
  };
  const initiateReceiver = async () => {
    try {
      // incomingRingAudio.pause();
      setCalleeUser(caller);
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      const Data = {
        chatId,
        answer,
      };
      socket.emit("receive-call", Data);
    } catch (err) {
      handleCallEndInitiator();
      // console.log(err);
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
      handleCallEndInitiator();
      // console.log(err);
      navigate(-1);
    }
  };

  const handleScreenShare = () => {
    try {
      setErrorMessage("no errorMessage");
      navigator.mediaDevices.getDisplayMedia({screen: true, audio: true}).then((stream) => {
        const videoSender = peer.getSenders().find((s) => s.track?.kind === "video");
        const screenTrack = stream.getTracks()[0];
        stream.getTracks().forEach(async (track) => {
          if (videoSender) {
            await videoSender.replaceTrack(track);
          } else {
            peer.addTrack(track, stream);
          }
        });

        myStreamRef.current.srcObject = stream;
        streamRef.current = stream;
        setScreenShare(true);
        screenTrack.onended = () => {
          // When screen share ends (user clicks stop sharing)
          stopScreenShare();
        };
      });
    } catch (err) {
      alert("Unable to share screen", err);
      // console.log(err);
      setErrorMessage(err);
    }
  };

  const stopScreenShare = async () => {
    try {
      navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
        const videoSender = peer.getSenders().find((s) => s.track?.kind === "video");
        const screenTrack = stream.getTracks()[0];
        stream.getTracks().forEach(async (track) => {
          if (videoSender) {
            await videoSender.replaceTrack(track);
          } else {
            peer.addTrack(track, stream);
          }
        });
        setScreenShare(false);
        myStreamRef.current.srcObject = stream;
        streamRef.current = stream;
      });
    } catch (err) {
      alert("Unable to stop share screen");
      // console.log(err);
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
      // console.log(event);
    };
    socket.on("join-callees", async (answer) => {
      // ringAudio.pause();
      await peer.setRemoteDescription(answer);
      // console.log(answer);
      // clearInterval(ringAudioRef.current);
      ringAudio.pause();
      ringAudio.currentTime = 0;
    });
    socket.on("new-candidate", async (candidate) => {
      // ringAudio.pause();
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
  useEffect(() => {
    if (!isHidden) {
      setTimeout(() => {
        setIsHidden(true);
      }, 3000);
    }
  });
  useEffect(() => {
    window.addEventListener("click", () => {
      setIsHidden(false);
    });
  }, []);
  return (
    <>
      {!isHidden && calleeUser?.username ? (
        <div className="fixed top-0 bg-zinc-800 w-full h-15 rounded-b-md flex items-center  p-4 ">
          <span className="capitalize bg-gradient-to-br from-purple-900/30 to-blue-900/30 px-4 py-2 rounded-full mr-1">{calleeUser?.username[0]}</span>
          <h3>{calleeUser?.username}</h3>
        </div>
      ) : (
        <></>
      )}
      {/* <div className="w-full bg-white text-red-500 h-full">{errorMessage ? errorMessage : "Null"}</div> */}
      <div className="w-full h-screen bg-black  text-white ">
        <video
          autoPlay
          playsInline
          ref={frndsStreamRef}
          className={`w-full h-full rounded-4xl scale-x-[-1] absolute  `}
        />
        <div className={`fixed MyStream sm:w-[30%] w-[50%]   z-20  right-0 ${isHidden ? "bottom-0" : "bottom-14"}`}>
          <video
            autoPlay
            muted
            playsInline
            ref={myStreamRef}
            className={` scale-x-[-1] p-2 rounded-2xl`}
          />
        </div>
        {!isHidden ? (
          <div className="fixed bottom-0 bg-zinc-800 w-full h-15 rounded-t-md flex items-center justify-between p-4 ">
            <button
              className="bg-zinc-500 p-3 rounded-full"
              onClick={() => handleScreenShare()}>
              <ScreenShare />
            </button>
            <button
              className="bg-red-500 p-3 rounded-full"
              onClick={() => handleCallEndInitiator()}>
              <PhoneOff />
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Call;
