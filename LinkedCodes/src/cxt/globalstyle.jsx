// src/globalStyles.js
import { StyleSheet } from 'react-native';

const globalStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.background || '#EAF1FF',
  },
  listContainer: {
    paddingBottom: 20,
  },
  reviewContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: theme.cardBackground || '#FFFFFF',
    alignItems: 'flex-start',
  },
  reviewContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.text || '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  star: {
    fontSize: 18,
    color: theme.starColor || '#FFD700',
    marginRight: 2,
  },
  comment: {
    fontSize: 14,
    color: theme.text || '#000',
  },
  newReviewContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: theme.cardBackground || '#FFFFFF',
  },
  input: {
    height: 40,
    borderColor: theme.border || '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: theme.text || '#000',
  },
  button: {
    backgroundColor: theme.primary || '#202A44',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default globalStyles;
