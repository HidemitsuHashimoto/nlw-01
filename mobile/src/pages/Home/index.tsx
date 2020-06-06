import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation, useRoute } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';

import api from '../../services/api'

interface IBGEUFResponse {
  data: {
    sigla: string;
  }[];
}

interface IBGECityResponse {
  data: {
    nome: string;
  }[];
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')

  const navigation = useNavigation()

  useEffect(() => {
    api.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then((response: IBGEUFResponse) => {
      const ufsAcronymes = response.data.map(uf => uf.sigla)
      setUfs(ufsAcronymes)
    })
  }, [])

  useEffect(() => {
    api.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`).then((response: IBGECityResponse) => {
      const city = response.data.map(city => city.nome)
      setCities(city)
    })
  }, [selectedUf])

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    })
  }

  function handleSelectUf(uf: string) {
    setSelectedUf(uf)
    setSelectedCity('')
  }

  function handleSelectCity(city: string) {
    setSelectedCity(city)
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de residuos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          style={styles}
          value={selectedUf}
          onValueChange={uf => handleSelectUf(uf)}
          items={ufs.map(uf => ({ label: uf, value: uf }))}
          placeholder={{ label: 'Digite a UF', value: '0' }}
        />
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          style={styles}
          value={selectedCity}
          onValueChange={city => handleSelectCity(city)}
          items={cities.map(city => ({ label: city, value: city }))}
          placeholder={{ label: 'Digite a cidade', value: '0' }}
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name='arrow-right' color='#fff' size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home