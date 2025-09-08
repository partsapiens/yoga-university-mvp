import { POSES } from './poses';

// This is a very simple cue builder. A real app would have a more complex system.
const CUE_MAP: Record<string, string> = {
  mountain: "Ground down through your feet. Lengthen your spine.",
  down_dog: "Press the mat away. Lift your hips high.",
  forward_fold: "Hinge at your hips. Let your head hang heavy.",
  warrior1_r: "Square your hips to the front. Reach your arms up.",
  warrior2_r: "Open your hips to the side. Gaze over your front fingertips.",
  high_lunge_r: "Keep your back leg strong. Sink into your front knee.",
  bridge: "Lift your hips off the floor. Squeeze your glutes.",
  pigeon_r: "Keep your hips level. Walk your hands forward to fold.",
  boat: "Engage your core. Keep your chest lifted.",
  child: "Rest your forehead on the mat. Breathe into your back.",
  savasana: "Relax your entire body. Let go of your breath.",
  butterfly: "Sit up tall. Gently press your knees towards the floor.",
};

export function getPoseCue(poseId: string, breathingCues: boolean): string {
  const pose = POSES.find(p => p.id === poseId);
  if (!pose) return "";

  let cue = CUE_MAP[poseId] || `Settle into ${pose.name}.`;

  if (breathingCues) {
    // A very simple heuristic for breathing cues
    if (pose.family === 'Backbend') {
      cue += " Inhale to open your chest.";
    } else if (pose.family === 'Twist') {
      cue += " Exhale to deepen the twist.";
    } else if (pose.family === 'Standing' || pose.family === 'Hip Opener') {
      cue += " Inhale, lengthen. Exhale, deepen the stretch.";
    }
  }

  return cue;
}
