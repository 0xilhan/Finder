// A simple utility for playing UI sound effects.

// A single Audio instance is created and reused to prevent memory leaks and performance issues.
let clickAudio: HTMLAudioElement | null = null;

const CLICK_SOUND_URL = 'https://uploads.codesandbox.io/uploads/user/a5286959-6a3d-4598-9781-8b013a531e2b/gL0E-ui_tap-variant-01.mp3';

/**
 * Plays a click sound effect.
 * Safe to call in any environment; does nothing if `window` is not available.
 */
export const playClickSound = () => {
    // Only run in the browser
    if (typeof window !== 'undefined') {
        if (!clickAudio) {
            clickAudio = new Audio(CLICK_SOUND_URL);
            clickAudio.volume = 0.4; // Set a moderate volume
        }
        
        // Rewind to the start so the sound can be played again quickly
        clickAudio.currentTime = 0;
        
        // play() returns a promise which can be rejected if autoplay is blocked.
        clickAudio.play().catch(error => {
            console.warn("SFX playback failed. This is common if the user hasn't interacted with the page yet.", error);
        });
    }
};
