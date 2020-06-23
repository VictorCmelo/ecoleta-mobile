import React, { useState, useEffect, ChangeEvent } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface itensSelectUF {
  label: string[];
  value: string[];
}

const Home = () => {
  const [ufs, setUfs] = useState<itensSelectUF>([]);
  const [cityes, setCityes] = useState<itensSelectUF>([]);

  const [uf, setUf] = useState("0");
  const [city, setCity] = useState("0");
  const navigation = useNavigation();

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitias = response.data.map((uf) => uf.sigla);

        const items = ufInitias.map((item) => ({
          label: item,
          value: item,
        }));

        setUfs(items);
      });
  }, []);

  useEffect(() => {
    if(selectedUf === '0'){
      return;
    }

    axios
    .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {
      const cityName = response.data.map(city => city.nome);

      const items = cityName.map((item) => ({
        label: item,
        value: item,
      }));


      setCityes(items);
    });
  },[selectedUf])

  function handleSelectUf(value){
    
    console.log(value);
    setSelectedUf(value);
  }

  function handleSelectCity(value){
    
    setSelectedCity(value);
  }


  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de residuos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={{
              label: "Selecione um estado",
              value: 0,
              color: "#9EA0A4",
            }}
            onValueChange={(value) => handleSelectUf(value)}
            style={styles}
            useNativeAndroidPickerStyle={false}
            items={ufs}
            Icon={() => {
              return (
                <Icon
                  style={styles.Icon}
                  name="chevron-down"
                  color="#000"
                  size={24}
                />
              );
            }}
          />

          <RNPickerSelect
            placeholder={{
              label: "Selecione uma cidade",
              value: 0,
              color: "#9EA0A4",
            }}
            onValueChange={(value) => handleSelectCity(value)}
            style={styles}
            useNativeAndroidPickerStyle={false}
            items={cityes}
            Icon={() => {
              return (
                <Icon
                  style={styles.Icon}
                  name="chevron-down"
                  color="#000"
                  size={24}
                />
              );
            }}
          />
        

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  inputAndroid: {
    height: 60,
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  Icon: {
    top: 15,
    right: 15,
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
