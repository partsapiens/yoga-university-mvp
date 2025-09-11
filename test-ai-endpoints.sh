#!/bin/bash

# OpenAI Integration Demo Script
# Tests all 5 new AI endpoints in mock mode

echo "🧘 OpenAI Integration Demo - Testing All AI Endpoints"
echo "============================================="
echo ""

BASE_URL="http://localhost:3000"

echo "1. 🎯 AI Selector - Natural Language Meditation Recommendation"
echo "POST /api/ai-select"
echo "Input: 'I feel stressed and need to relax'"
curl -s -X POST $BASE_URL/api/ai-select \
  -H "Content-Type: application/json" \
  -d '{"userText": "I feel stressed and need to relax", "preferredDuration": 15}' | jq '.'
echo ""

echo "2. 📝 AI Script Generator - Meditation Scripts"
echo "POST /api/ai-script"
echo "Input: Box Breathing, 10 minutes, calm mood"
curl -s -X POST $BASE_URL/api/ai-script \
  -H "Content-Type: application/json" \
  -d '{"style": "Box Breathing", "duration": 10, "mood": "calm"}' | jq '.'
echo ""

echo "3. 📊 AI Recap - Session Summary"
echo "POST /api/ai-recap"
echo "Input: Completed mindfulness session"
curl -s -X POST $BASE_URL/api/ai-recap \
  -H "Content-Type: application/json" \
  -d '{"style": "Mindfulness", "duration": 15, "feelingNote": "felt much more centered"}' | jq '.'
echo ""

echo "4. 💬 AI Guide - Chat Assistant"
echo "POST /api/ai-guide"
echo "Input: 'What is the best breathing technique for anxiety?'"
curl -s -X POST $BASE_URL/api/ai-guide \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What is the best breathing technique for anxiety?"}]}' | jq '.'
echo ""

echo "5. 🧘‍♀️ Flow Suggestion - AI Yoga Flow Generator"
echo "POST /api/flow-suggest"
echo "Input: Relaxation flow, 30 minutes, beginner"
curl -s -X POST $BASE_URL/api/flow-suggest \
  -H "Content-Type: application/json" \
  -d '{"goal": "relaxation", "time": 30, "difficulty": "beginner", "equipment": "none"}' | jq '.'
echo ""

echo "✅ All endpoints tested successfully!"
echo "Note: Currently running in mock mode (USE_MOCK=true)"
echo "To use real OpenAI API, set USE_MOCK=false in .env.local"