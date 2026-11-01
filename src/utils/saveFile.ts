import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

// Browser downloads do not exist inside the native apps, so there the file goes through the share sheet
export const saveTextFile = async (fileName: string, content: string): Promise<'done' | 'cancelled'> => {
  if (Capacitor.isNativePlatform()) {
    const { uri } = await Filesystem.writeFile({
      path: fileName,
      data: content,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });
    try {
      await Share.share({ title: fileName, files: [uri] });
    } catch (error) {
      if (error instanceof Error && /cancel/i.test(error.message)) return 'cancelled';
      throw error;
    }
    return 'done';
  }

  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'done';
};
