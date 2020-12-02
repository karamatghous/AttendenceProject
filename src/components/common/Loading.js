import React from 'react';
import {View, ActivityIndicator} from 'react-native';

const Loader = ({size}) => {
  return (
    <View style={styles.loadingStyles}>
      <ActivityIndicator size={size || 'large'} />
    </View>
  );
};

const styles = {
  loadingStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export {Loader};
