import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';

const profilesData = [
  { id: '1', nom: 'John', prenom: 'Doe', tel: '+1234567890' },
  { id: '2', nom: 'Jane', prenom: 'Smith', tel: '+1987654321' },
  { id: '3', nom: 'Alex', prenom: 'Johnson', tel: '+1122334455' },
  // Add more profiles as needed
];

const List_Profile = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState(profilesData);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = profilesData.filter(
      (profile) =>
        profile.nom.toLowerCase().includes(text.toLowerCase()) ||
        profile.prenom.toLowerCase().includes(text.toLowerCase()) ||
        profile.tel.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProfiles(filtered);
  };

  const renderProfile = ({ item }) => (
    <View style={styles.profileItem}>
      <Text>{`${item.nom} ${item.prenom}`}</Text>
      <Text>{item.tel}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search profiles..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredProfiles}
        keyExtractor={(item) => item.id}
        renderItem={renderProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  profileItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default List_Profile;
