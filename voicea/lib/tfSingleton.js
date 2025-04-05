import * as tf from "@tensorflow/tfjs";

// ✅ Check if TensorFlow is already loaded
if (!globalThis.tf) {
  globalThis.tf = tf;
}

export default globalThis.tf;
