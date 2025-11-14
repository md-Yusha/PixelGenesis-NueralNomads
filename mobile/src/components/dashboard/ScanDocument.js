import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { getIPFSFileUrl } from '../../utils/ipfs';
import { formatAddress } from '../../utils/helpers';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ScanDocument = ({ account }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'upload'

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    try {
      let shareData;
      try {
        shareData = JSON.parse(data);
      } catch (e) {
        if (data.startsWith('http')) {
          const url = new URL(data);
          const dataParam = url.searchParams.get('data');
          if (dataParam) {
            shareData = JSON.parse(decodeURIComponent(dataParam));
          } else {
            throw new Error('Invalid QR code format');
          }
        } else {
          throw new Error('Invalid QR code format');
        }
      }

      if (!shareData.ipfsHash || !shareData.documentName) {
        throw new Error('Invalid document data in QR code');
      }

      setDocumentData({
        ...shareData,
        ipfsUrl: shareData.ipfsUrl || getIPFSFileUrl(shareData.ipfsHash)
      });
    } catch (err) {
      console.error('Error processing scanned data:', err);
      Alert.alert('Error', `Failed to process QR code: ${err.message}`);
      setScanned(false);
    }
  };

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your photos to scan QR codes.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        // For now, guide user to use camera scan
        // Image QR scanning requires additional native module setup
        Alert.alert(
          'Image Scanning',
          'Image file QR scanning is not yet available. Please use the Camera Scan mode to scan QR codes directly.',
          [{ text: 'OK', onPress: () => setScanMode('camera') }]
        );
      }
    } catch (error) {
      console.error('Error in image upload:', error);
      Alert.alert('Error', 'Failed to access image library. Please use Camera Scan mode.');
    }
  };

  const handleDownload = async () => {
    if (!documentData?.ipfsUrl) return;

    try {
      const downloadPath = `${FileSystem.documentDirectory}${documentData.documentName || 'document'}`;
      const downloadResult = await FileSystem.downloadAsync(documentData.ipfsUrl, downloadPath);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert('Success', 'File downloaded to: ' + downloadPath);
      }
    } catch (err) {
      console.error('Error downloading document:', err);
      Alert.alert('Error', 'Failed to download document. Please try again.');
    }
  };

  const resetScan = () => {
    setScanned(false);
    setDocumentData(null);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Scan Document</Text>
      <Text style={styles.description}>
        Scan a QR code or upload an image to access shared documents.
      </Text>

      {!documentData ? (
        <View style={styles.card}>
          {/* Mode Selection */}
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeButton, styles.modeButtonFirst, scanMode === 'camera' && styles.activeMode]}
              onPress={() => {
                resetScan();
                setScanMode('camera');
              }}
            >
              <Icon name="camera" size={24} color={scanMode === 'camera' ? '#00ffff' : '#666666'} />
              <Text style={[styles.modeText, scanMode === 'camera' && styles.activeModeText]}>
                Camera Scan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, scanMode === 'upload' && styles.activeMode]}
              onPress={() => {
                resetScan();
                setScanMode('upload');
                handleImageUpload();
              }}
            >
              <Icon name="upload" size={24} color={scanMode === 'upload' ? '#00ffff' : '#666666'} />
              <Text style={[styles.modeText, scanMode === 'upload' && styles.activeModeText]}>
                Upload Image
              </Text>
            </TouchableOpacity>
          </View>

          {/* Camera Scanner */}
          {scanMode === 'camera' && (
            <View style={styles.cameraWrapper}>
              <View style={styles.cameraContainer}>
                {!scanned && (
                  <CameraView
                    style={styles.camera}
                    facing={CameraType.back}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                      barcodeTypes: ['qr'],
                    }}
                  />
                )}
                {scanned && (
                  <View style={styles.scannedOverlay}>
                    <Text style={styles.scannedText}>QR Code Scanned!</Text>
                    <TouchableOpacity style={styles.scanAgainButton} onPress={resetScan}>
                      <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {!scanned && (
                <View style={styles.scanFrame}>
                  <View style={styles.scanFrameCorner} />
                  <View style={[styles.scanFrameCorner, styles.scanFrameCornerTopRight]} />
                  <View style={[styles.scanFrameCorner, styles.scanFrameCornerBottomLeft]} />
                  <View style={[styles.scanFrameCorner, styles.scanFrameCornerBottomRight]} />
                </View>
              )}
            </View>
          )}
        </View>
      ) : (
        /* Document Display */
        <View style={styles.card}>
          <View style={styles.documentHeader}>
            <Icon name="file-document" size={28} color="#00ffff" style={styles.documentHeaderIcon} />
            <Text style={styles.documentTitle}>Shared Document</Text>
          </View>
          <TouchableOpacity style={styles.scanAnotherButton} onPress={resetScan}>
            <Icon name="qrcode-scan" size={16} color="#ffffff" style={styles.scanAnotherButtonIcon} />
            <Text style={styles.scanAnotherText}>Scan Another</Text>
          </TouchableOpacity>

          <View style={styles.documentInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Document Name</Text>
              <Text style={styles.infoValue}>{documentData.documentName}</Text>
            </View>

            {documentData.sender && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Shared by</Text>
                <Text style={styles.infoValue}>{formatAddress(documentData.sender)}</Text>
              </View>
            )}

            {documentData.timestamp && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Shared on</Text>
                <Text style={styles.infoValue}>
                  {new Date(documentData.timestamp).toLocaleString()}
                </Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Document Type</Text>
              <Text style={styles.infoValue}>
                {documentData.documentType || 'Unknown'}
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Icon name="download" size={20} color="#0a0a0f" style={styles.downloadButtonIcon} />
              <Text style={styles.downloadButtonText}>Download Document</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 24,
  },
  permissionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#444444',
    backgroundColor: '#2a2a3e',
  },
  modeButtonFirst: {
    marginRight: 12,
  },
  activeMode: {
    borderColor: '#00ffff',
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
  },
  modeText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  activeModeText: {
    color: '#00ffff',
  },
  cameraWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  cameraContainer: {
    width: '100%',
    height: Math.min(SCREEN_HEIGHT * 0.75, 650),
    minHeight: 500,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  scanFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -150,
    marginTop: -150,
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: 'transparent',
    zIndex: 10,
  },
  scanFrameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: '#00ffff',
    top: 0,
    left: 0,
  },
  scanFrameCornerTopRight: {
    borderLeftWidth: 0,
    borderRightWidth: 3,
    right: 0,
    left: 'auto',
  },
  scanFrameCornerBottomLeft: {
    borderTopWidth: 0,
    borderBottomWidth: 3,
    top: 'auto',
    bottom: 0,
  },
  scanFrameCornerBottomRight: {
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    top: 'auto',
    left: 'auto',
    right: 0,
    bottom: 0,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  scannedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    height: Math.min(SCREEN_HEIGHT * 0.75, 650),
  },
  scannedText: {
    color: '#00ffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scanAgainButton: {
    backgroundColor: '#00ffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanAgainText: {
    color: '#0a0a0f',
    fontSize: 14,
    fontWeight: 'bold',
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentHeaderIcon: {
    marginRight: 12,
  },
  documentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scanAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 20,
  },
  scanAnotherButtonIcon: {
    marginRight: 6,
  },
  scanAnotherText: {
    color: '#ffffff',
    fontSize: 12,
  },
  documentInfo: {
    marginBottom: 20,
  },
  infoRow: {
  },
  infoLabel: {
    fontSize: 12,
    color: '#999999',
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
  },
  buttonRow: {
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ffff',
    paddingVertical: 14,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: '#0a0a0f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#00ffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#0a0a0f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScanDocument;

