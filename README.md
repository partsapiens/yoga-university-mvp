# Generate Flow (Yoga Flow Builder)

This is a standalone page for composing, previewing, and playing yoga sequences. It is built with React, Next.js, and Tailwind CSS.

## Features

- **Auto-generation**: Create a yoga sequence based on a specified duration, intensity, and focus area.
- **Customization**: Manually add, remove, and reorder poses. Adjust the duration for each pose individually.
- **Playback**: Play the sequence with a timer, progress bars, and Text-to-Speech (TTS) cues.
- **Persistence**: Save your favorite flows to your device for later use.
- **Voice Control**: Use your voice to control the page settings via the AI assistant, or guide your practice with the Voice Coach widget.

## Keyboard Shortcuts

While the main player is active, you can use the following keyboard shortcuts:

| Key           | Action                               |
|---------------|--------------------------------------|
| `Space`       | Play / Pause / Resume the sequence.  |
| `ArrowRight`  | Skip to the next pose.               |
| `ArrowLeft`   | Go back to the previous pose.        |
| `[`           | Decrease playback speed (slower).    |
| `]`           | Increase playback speed (faster).    |

*Note: Shortcuts are disabled when you are typing in an input field.*

## Voice Commands

### Page Assistant (via 🤖 icon)
- **Control Settings**: "Set time to 30 minutes", "Intensity up", "Focus on hips".
- **Manage Flows**: "Name this flow Evening Cool Down", "Save flow".
- ...and many more.

### Voice Coach Widget (appears during practice)
- **Control Practice**: "Pause", "Next pose", "Repeat", "Slower".
- **Get Information**: "How long?", "Explain this pose".
