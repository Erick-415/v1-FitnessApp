import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@eazyfitness/shared/auth';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signUpSchema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const { signUpWithEmail } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SignUpForm) => {
    const { error } = await signUpWithEmail(data.email, data.password, 'client', data.fullName);
    if (error) {
      Alert.alert('Sign up failed', error);
    } else {
      Alert.alert('Check your email', 'We sent you a confirmation link.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Start your fitness journey</Text>

      <View style={styles.form}>
        {(
          [
            { name: 'fullName', placeholder: 'Full Name', autoComplete: 'name' },
            { name: 'email', placeholder: 'Email', autoComplete: 'email', keyboardType: 'email-address' },
            { name: 'password', placeholder: 'Password', autoComplete: 'new-password', secure: true },
            { name: 'confirmPassword', placeholder: 'Confirm Password', secure: true },
          ] as const
        ).map((field) => (
          <Controller
            key={field.name}
            control={control}
            name={field.name}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, errors[field.name] && styles.inputError]}
                  placeholder={field.placeholder}
                  secureTextEntry={field.secure}
                  autoCapitalize="none"
                  autoComplete={field.autoComplete}
                  keyboardType={field.keyboardType ?? 'default'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors[field.name] && (
                  <Text style={styles.errorText}>{errors[field.name]?.message}</Text>
                )}
              </View>
            )}
          />
        ))}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/sign-in" style={styles.link}>
            Sign In
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    gap: 12,
  },
  inputWrapper: {
    gap: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666',
  },
  link: {
    color: '#000',
    fontWeight: '600',
  },
});
