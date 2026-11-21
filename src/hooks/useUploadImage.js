import { useState, useCallback } from 'react';
import { File } from 'expo-file-system';
import { supabase } from '../lib/supabase';

function inferMimeAndExt(imageUrl) {
  const cleanUrl = imageUrl.split('?')[0].toLowerCase();
  const rawExt = cleanUrl.split('.').pop();

  const mimeMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    heic: 'image/heic',
  };

  if (mimeMap[rawExt]) {
    return {
      ext: rawExt === 'jpeg' ? 'jpg' : rawExt,
      contentType: mimeMap[rawExt],
    };
  }

  return { ext: 'jpg', contentType: 'image/jpeg' };
}

async function uriToArrayBuffer(imageUrl) {
  if (imageUrl.startsWith('file://')) {
    const file = new File(imageUrl);
    if (!file.exists) {
      throw new Error('Selected image file no longer exists in cache. Please pick it again.');
    }
    const bytes = await file.bytes();
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  }

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image URI (status ${response.status})`);
  }
  return await response.arrayBuffer();
}

export function useUploadImage(bucket = 'images') {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [publicUrl, setPublicUrl] = useState(null);

  const uploadImage = useCallback(
    async (imageUrl, folder = 'uploads') => {
      if (!imageUrl) {
        const err = new Error('No imageUrl provided.');
        setError(err);
        throw err;
      }

      setUploading(true);
      setError(null);

      try {
        const arrayBuffer = await uriToArrayBuffer(imageUrl);

        const { ext, contentType } = inferMimeAndExt(imageUrl);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, arrayBuffer, {
            contentType,
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        setPublicUrl(urlData.publicUrl);

        return {
          path: data.path,
          publicUrl: urlData.publicUrl,
        };
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [bucket]
  );

  return {
    uploadImage,
    uploading,
    error,
    publicUrl,
  };
}