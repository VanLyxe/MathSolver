import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { storageService } from '../../services/storageService';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    // Créer une prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload l'image
    setUploading(true);
    try {
      const url = await storageService.uploadImage(file);
      if (url) {
        onImageUploaded(url);
        toast.success('Image uploadée avec succès');
      } else {
        throw new Error('Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUploaded('');
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Aperçu" 
            className="max-h-48 mx-auto rounded"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center cursor-pointer">
          <Upload className={`h-8 w-8 ${uploading ? 'text-purple-500 animate-pulse' : 'text-gray-400'} mb-2`} />
          <span className="text-sm text-gray-500 text-center">
            {uploading ? 'Upload en cours...' : 'Glissez une image ou cliquez pour sélectionner'}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;