import axios from 'axios';
import { IPFS_CONFIG } from '../config';
import * as FileSystem from 'expo-file-system';

/**
 * Upload a file to IPFS using Pinata
 * @param {string} fileUri - The local file URI to upload
 * @param {string} fileName - The file name
 * @returns {Promise<string>} - The IPFS hash (CID)
 */
export const uploadToIPFS = async (fileUri, fileName = 'document') => {
  try {
    // Use Pinata if configured (prefer JWT, fallback to API key/secret)
    if (IPFS_CONFIG.usePinata) {
      if (IPFS_CONFIG.pinataJWT) {
        return await uploadToPinata(fileUri, fileName);
      } else if (IPFS_CONFIG.pinataApiKey && IPFS_CONFIG.pinataApiSecret) {
        return await uploadToPinataWithApiKey(fileUri, fileName);
      }
    }
    
    throw new Error('Pinata is not configured. Please set EXPO_PUBLIC_PINATA_JWT in your .env file.');
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
};

/**
 * Upload file to Pinata
 * @param {string} fileUri - The local file URI
 * @param {string} fileName - The file name
 * @returns {Promise<string>} - The IPFS hash (CID)
 */
const uploadToPinata = async (fileUri, fileName) => {
  try {
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to blob
    const response = await fetch(`data:application/octet-stream;base64,${base64}`);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob, fileName);

    // Add metadata
    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        app: 'PixelLocker',
        type: 'credential-document',
      },
    });
    formData.append('pinataMetadata', metadata);

    // Add options for pinning
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', pinataOptions);

    const uploadResponse = await axios.post(
      `${IPFS_CONFIG.pinataApiUrl}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${IPFS_CONFIG.pinataJWT}`,
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    const ipfsHash = uploadResponse.data.IpfsHash;
    
    if (!ipfsHash) {
      throw new Error('Pinata upload failed: No hash returned');
    }

    console.log('File uploaded to Pinata:', ipfsHash);
    return ipfsHash;
  } catch (error) {
    console.error('Pinata upload error:', error);
    if (error.response) {
      throw new Error(`Pinata upload failed: ${error.response.data?.error?.details || error.response.statusText}`);
    }
    throw error;
  }
};

/**
 * Upload file to Pinata using API Key/Secret
 */
const uploadToPinataWithApiKey = async (fileUri, fileName) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await fetch(`data:application/octet-stream;base64,${base64}`);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob, fileName);

    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        app: 'PixelLocker',
        type: 'credential-document',
      },
    });
    formData.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', pinataOptions);

    const uploadResponse = await axios.post(
      `${IPFS_CONFIG.pinataApiUrl}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'pinata_api_key': IPFS_CONFIG.pinataApiKey,
          'pinata_secret_api_key': IPFS_CONFIG.pinataApiSecret,
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    const ipfsHash = uploadResponse.data.IpfsHash;
    
    if (!ipfsHash) {
      throw new Error('Pinata upload failed: No hash returned');
    }

    console.log('File uploaded to Pinata (API Key):', ipfsHash);
    return ipfsHash;
  } catch (error) {
    console.error('Pinata API Key upload error:', error);
    if (error.response) {
      throw new Error(`Pinata upload failed: ${error.response.data?.error?.details || error.response.statusText}`);
    }
    throw error;
  }
};

/**
 * Upload JSON data to IPFS using Pinata
 * @param {Object} data - The JSON data to upload
 * @returns {Promise<string>} - The IPFS hash (CID)
 */
export const uploadJSONToIPFS = async (data) => {
  try {
    if (IPFS_CONFIG.usePinata) {
      if (IPFS_CONFIG.pinataJWT) {
        return await uploadJSONToPinata(data);
      } else if (IPFS_CONFIG.pinataApiKey && IPFS_CONFIG.pinataApiSecret) {
        return await uploadJSONToPinataWithApiKey(data);
      }
    }
    
    throw new Error('Pinata is not configured. Please set EXPO_PUBLIC_PINATA_JWT in your .env file.');
  } catch (error) {
    console.error('IPFS JSON upload error:', error);
    throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
  }
};

/**
 * Upload JSON to Pinata
 */
const uploadJSONToPinata = async (data) => {
  try {
    const response = await axios.post(
      `${IPFS_CONFIG.pinataApiUrl}/pinning/pinJSONToIPFS`,
      {
        pinataContent: data,
        pinataMetadata: {
          name: 'nexid-proof',
          keyvalues: {
            app: 'PixelLocker',
            type: 'selective-disclosure-proof',
          },
        },
        pinataOptions: {
          cidVersion: 1,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${IPFS_CONFIG.pinataJWT}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    
    if (!ipfsHash) {
      throw new Error('Pinata JSON upload failed: No hash returned');
    }

    console.log('JSON uploaded to Pinata:', ipfsHash);
    return ipfsHash;
  } catch (error) {
    console.error('Pinata JSON upload error:', error);
    if (error.response) {
      throw new Error(`Pinata JSON upload failed: ${error.response.data?.error?.details || error.response.statusText}`);
    }
    throw error;
  }
};

/**
 * Upload JSON to Pinata using API Key/Secret
 */
const uploadJSONToPinataWithApiKey = async (data) => {
  try {
    const response = await axios.post(
      `${IPFS_CONFIG.pinataApiUrl}/pinning/pinJSONToIPFS`,
      {
        pinataContent: data,
        pinataMetadata: {
          name: 'nexid-proof',
          keyvalues: {
            app: 'PixelLocker',
            type: 'selective-disclosure-proof',
          },
        },
        pinataOptions: {
          cidVersion: 1,
        },
      },
      {
        headers: {
          'pinata_api_key': IPFS_CONFIG.pinataApiKey,
          'pinata_secret_api_key': IPFS_CONFIG.pinataApiSecret,
          'Content-Type': 'application/json',
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    
    if (!ipfsHash) {
      throw new Error('Pinata JSON upload failed: No hash returned');
    }

    console.log('JSON uploaded to Pinata (API Key):', ipfsHash);
    return ipfsHash;
  } catch (error) {
    console.error('Pinata API Key JSON upload error:', error);
    if (error.response) {
      throw new Error(`Pinata JSON upload failed: ${error.response.data?.error?.details || error.response.statusText}`);
    }
    throw error;
  }
};

/**
 * Retrieve file from IPFS
 * @param {string} ipfsHash - The IPFS hash (CID)
 * @returns {Promise<string>} - The file content URL
 */
export const getIPFSFileUrl = (ipfsHash) => {
  if (IPFS_CONFIG.usePinata && IPFS_CONFIG.pinataJWT) {
    return `${IPFS_CONFIG.gatewayUrl}${ipfsHash}`;
  }
  return `${IPFS_CONFIG.publicGatewayUrl}${ipfsHash}`;
};

/**
 * Fetch JSON data from IPFS
 * @param {string} ipfsHash - The IPFS hash (CID)
 * @returns {Promise<Object>} - The JSON data
 */
export const fetchJSONFromIPFS = async (ipfsHash) => {
  try {
    const url = getIPFSFileUrl(ipfsHash);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error(`Failed to fetch from IPFS: ${error.message}`);
  }
};

