import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Lazy load BarCodeScanner to handle cases where it's not available
let BarCodeScanner: any = null;
let isScannerAvailable = false;

try {
  const barcodeScanner = require('expo-barcode-scanner');
  BarCodeScanner = barcodeScanner.BarCodeScanner || barcodeScanner.default?.BarCodeScanner;
  isScannerAvailable = !!BarCodeScanner;
} catch (e) {
  // BarCodeScanner not available (e.g., in Expo Go)
  isScannerAvailable = false;
}

export function ScanQrScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    if (!isScannerAvailable) {
      setHasPermission(false);
      return;
    }

    (async () => {
      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (e) {
        setHasPermission(false);
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      // Try to parse as JSON (VC)
      const parsed = JSON.parse(data);
      // Navigate back to Verify screen with the JSON
      navigation.navigate('Main', {
        screen: 'Verify',
        params: { prefillJson: JSON.stringify(parsed, null, 2) },
      });
    } catch {
      // If not JSON, treat as hash or URL
      // Check if it's a URL
      if (data.startsWith('http://') || data.startsWith('https://')) {
        Alert.alert(
          'URL Detected',
          'This appears to be a URL. Would you like to open it?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setScanned(false) },
            {
              text: 'Open',
              onPress: () => {
                Linking.openURL(data).catch(() => {
                  Alert.alert('Error', 'Failed to open URL');
                });
                setScanned(false);
              },
            },
          ]
        );
      } else {
        // Treat as hash
        navigation.navigate('Main', {
          screen: 'Verify',
          params: { prefillHash: data },
        });
      }
    }
  };

  if (hasPermission === null) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Requesting camera permission...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleManualSubmit = () => {
    if (!manualInput.trim()) {
      Alert.alert('Error', 'Please enter a QR code value');
      return;
    }
    handleBarCodeScanned({ data: manualInput.trim() });
  };

  // If scanner is not available, show manual input
  if (!isScannerAvailable) {
    return (
      <ScreenContainer scrollable>
        <View style={styles.manualContainer}>
          <Text style={styles.title}>QR Code Scanner</Text>
          <Text style={styles.subtitle}>
            QR scanning is not available in Expo Go. Please paste the QR code content or hash below.
          </Text>
          <Input
            label="QR Code Content"
            value={manualInput}
            onChangeText={setManualInput}
            placeholder="Paste QR code content, VC JSON, or hash here"
            multiline
            numberOfLines={6}
            style={styles.input}
          />
          <Button
            title="Process QR Code"
            onPress={handleManualSubmit}
            style={styles.submitButton}
          />
        </View>
      </ScreenContainer>
    );
  }

  if (hasPermission === false) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Camera permission is required to scan QR codes</Text>
          <Button
            title="Grant Permission"
            onPress={async () => {
              try {
                const { status } = await BarCodeScanner.requestPermissionsAsync();
                setHasPermission(status === 'granted');
              } catch (e) {
                Alert.alert('Error', 'Failed to request camera permission');
              }
            }}
            style={styles.button}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {BarCodeScanner && (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.instruction}>Position the QR code within the frame</Text>
          {scanned && (
            <Button
              title="Scan Again"
              onPress={() => setScanned(false)}
              style={styles.scanAgainButton}
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#007AFF',
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderRightWidth: 3,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    borderBottomWidth: 3,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  instruction: {
    color: '#fff',
    fontSize: 16,
    marginTop: 32,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  scanAgainButton: {
    marginTop: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  manualContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 16,
  },
});

