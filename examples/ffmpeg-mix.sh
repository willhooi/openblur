#!/bin/bash
# FFmpeg one-liner: mix Remotion video + VO narration + background music + karaoke subtitles
#
# Inputs:
#   video.mp4    — Remotion-rendered video (silent)
#   vo.mp3       — ElevenLabs voiceover
#   music.wav    — MusicGen background music
#   subs.ass     — Karaoke ASS subtitles
#
# Output:
#   final.mp4    — Mixed video with audio + subtitles

ffmpeg -y \
  -i video.mp4 \
  -i vo.mp3 \
  -i music.wav \
  -filter_complex "\
    [0:v]ass='subs.ass'[vout]; \
    [1:a]volume=1.6dB[vo]; \
    [2:a]volume=-10dB[music]; \
    [vo][music]amix=inputs=2:duration=first:weights=2.5 1[aout]" \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset fast -crf 20 \
  -c:a aac -ar 48000 -ac 2 \
  -shortest -movflags +faststart \
  final.mp4
