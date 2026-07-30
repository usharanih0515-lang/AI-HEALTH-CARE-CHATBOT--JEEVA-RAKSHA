/**
 * =============================================================================
 * Jeeva Raksha — Reusable Card Component (components/common/Card.js)
 * =============================================================================
 * Description : A flexible container component styled as a card with optional
 *               shadow, border, press interaction, and gradient background.
 *
 * Props       :
 *   children  {node}     — Card content
 *   onPress   {function} — Makes the card tappable (optional)
 *   style     {object}   — Additional container styles
 *   padding   {number}   — Inner padding override
 *
 * Usage       :
 *   <Card>
 *     <Text>Card Content</Text>
 *   </Card>
 *   <Card onPress={handlePress}>
 *     <Text>Tappable Card</Text>
 *   </Card>
 *
 * Author      : Jeeva Raksha Dev Team
 * =============================================================================
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';

/**
 * Card — Surface container with optional press interaction.
 */
const Card = ({ children, onPress, style, padding }) => {
  const containerStyle = [
    styles.card,
    SHADOWS.card,
    padding !== undefined && { padding },
    style,
  ];

  // Render a touchable card if onPress is provided
  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius   : RADIUS.lg,
    padding        : SPACING.md,
    borderWidth    : 1,
    borderColor    : COLORS.border,
  },
});

export default Card;
