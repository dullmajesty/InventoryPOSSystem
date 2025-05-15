import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://192.168.1.9:8000/api/login/', {
        username: username.trim(),
        password,
      });

      const { token, role } = response.data;
      const normalizedRole = role?.toLowerCase();

      if (normalizedRole === 'admin') {
        router.push('/(drawer)/AdminDashboard');
      } else if (normalizedRole === 'cashier') {
        router.push('/(drawer)/dashboard/CashierDashboard');
      } else {
        setError('Unauthorized role');
      }
    } catch (err) {
      console.error('Login error:', err?.response?.data || err.message);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#A1C4FD', '#C2E9FB']} style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.header}>SST Inventory POS</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Username */}
        <View style={styles.inputGroup}>
          <FontAwesome5 name="user" size={22} color="#7FC8A9" style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#888"
            autoCapitalize="none"
          />
        </View>

        {/* Password with toggle */}
        <View style={styles.inputGroup}>
          <FontAwesome5 name="lock" size={22} color="#7FC8A9" style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconRight}
          >
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={22} color="#7FC8A9" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && { backgroundColor: '#7a9dfb' }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBox: {
    width: 300,
    backgroundColor: '#ffffff',
    paddingBottom: 30,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    backgroundColor: '#4e73df',
    textAlign: 'center',
    color: '#fff',
    paddingVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginHorizontal: 30,
    marginTop: 22,
    position: 'relative',
    justifyContent: 'center',
  },
  iconLeft: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  input: {
    paddingLeft: 45,
    paddingRight: 45,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    fontSize: 16,
    height: 50,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    marginTop: 25,
    marginHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#4e73df',
  },
  loginText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 15,
  },
});

export default LoginScreen;
