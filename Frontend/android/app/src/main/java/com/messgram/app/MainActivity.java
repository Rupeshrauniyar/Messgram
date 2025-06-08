package com.messgram.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.capacitorjs.plugins.splashscreen.SplashScreenPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Set the theme to AppTheme BEFORE onCreate to support 
        // coloring the background, status bar, and navigation bar
        setTheme(R.style.AppTheme_NoActionBarLaunch);
        
        super.onCreate(savedInstanceState);
        
        // Register plugins
        registerPlugin(SplashScreenPlugin.class);
    }
}
