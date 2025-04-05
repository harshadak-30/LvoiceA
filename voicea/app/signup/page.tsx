"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { motion } from "framer-motion";
import { VoiceAssistant } from "@/components/Chatbot";
import { Mic } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [userType, setUserType] = useState("student");
  const [isAssistantOpen, setIsAssistantOpen] = useState(false); // Fix: Add missing state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    expertise: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Prepare request payload
    const newUser = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      userType,
      expertise: userType === "teacher" ? formData.expertise : undefined,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("✅ Account created successfully! Redirecting to login...");
        setError("");

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
          <p className="text-gray-600 mt-2">Join our learning community today</p>
        </div>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-center text-green-600 mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup defaultValue="student" onValueChange={(value) => setUserType(value)} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher">Teacher</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" value={formData.name} onChange={handleChange} required className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required className="w-full" placeholder="+91 0000000000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleChange} required className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="w-full" />
          </div>

          {userType === "teacher" && (
            <div className="space-y-2">
              <Label htmlFor="expertise">Area of Expertise</Label>
              <select
                id="expertise"
                value={formData.expertise}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="" disabled>Select your area of expertise</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Languages">Languages</option>
                <option value="Arts">Arts</option>
                <option value="Technology">Technology</option>
                <option value="Physical Education">Physical Education</option>
                <option value="Social Studies">Social Studies</option>
              </select>
            </div>
          )}

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
            Sign in
          </Link>
        </div>
      </motion.div>

      {/* Voice Assistant Button */}
      {isAssistantOpen && <VoiceAssistant onClose={() => setIsAssistantOpen(false)} />}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-purple-600 text-white rounded-full shadow-lg"
      >
        <Mic className="h-6 w-6" />
      </button>
    </div>
  );
}
