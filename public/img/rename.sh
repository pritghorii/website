#!/bin/bash

shopt -s nullglob

# Get existing numbered images (any extension)
existing=(image*.*)

max=0

# Find highest existing number
for file in "${existing[@]}"; do
  if [[ $file =~ ^image([0-9]+)\.(jpg|jpeg|png|gif)$ ]]; then
    num="${BASH_REMATCH[1]}"
    if (( num > max )); then
      max=$num
    fi
  fi
done

count=$((max + 1))

# Rename unnumbered images
for file in *.{jpg,jpeg,png,gif}; do
  if [[ -f "$file" && ! $file =~ ^image[0-9]+\.(jpg|jpeg|png|gif)$ ]]; then
    extension="${file##*.}"
    mv "$file" "image$count.$extension"
    ((count++))
  fi
done
