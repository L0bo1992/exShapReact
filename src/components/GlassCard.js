import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function GlassCard({ children, style, onPress }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: 'rgba(30, 41, 59, 0.7)', // Semi-transparent slate
          borderColor: theme.colors.cardBorder,
          transform: [{ scale: pressed && onPress ? 0.98 : 1 }]
        },
        style
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    elevation: 8,
    // Using boxShadow for web compatibility and to resolve deprecation warnings
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
  },
});