import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@eazyfitness/shared/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const { signInWithEmail, signInWithApple } = useAuth();
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInForm) => {
    const { error } = await signInWithEmail(data.email, data.password);
    if (error) Alert.alert('Sign in failed', error);
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    const { error } = await signInWithApple();
    setIsAppleLoading(false);
    if (error) Alert.alert('Apple sign in failed', error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EazyFitness</Text>
      <Text style={styles.subtitle}>Trainer Portal</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                secureTextEntry
                autoComplete="password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>
          )}
        />

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        )}

        {isAppleLoading && <ActivityIndicator style={styles.appleLoader} />}

        <View style={styles.footer}>
          <Text style={styles.footerText}>New trainer? </Text>
          <Link href="/(auth)/sign-up" style={styles.link}>
            Create Account
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  form: { width: '100%', gap: 12 },
  inputWrapper: { gap: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12 },
  button: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  appleButton: { width: '100%', height: 48 },
  appleLoader: { marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: '#666' },
  link: { color: '#000', fontWeight: '600' },
});
