import React , {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, View, TextInput, Button, Text, Alert  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable} from 'react-native-paper';



const Calculation = ({route, navigation}) => {
  const [originalPrice, setOriginalPrice] = useState("");
  const [youSave, setyouSave] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [finalPrice, setfinalPrice] = useState("");
  const [error, seterror] = useState("");
  const [History, setHistory] = useState([]);
  const [id, setId] = useState(1);

  const onChangeOriginalPrice = (text) => {
    setOriginalPrice(text);
  }

  const onChangeDiscountPerdentage = (text) => {
    setDiscountPercentage(text);
  }

  useEffect(() => {
    if (route.params?.history){
      setHistory(route.params.history);
      navigation.setParams({ history: undefined })
    }

  });

  const calcDiscount = () => {
    const price = eval(originalPrice);
    const discount = eval(discountPercentage);
    if (discount<100){
      setyouSave( (price/100 * discount).toFixed(2));
      setfinalPrice((price - youSave).toFixed(2)); 
      seterror("")
    }
    else {
      setyouSave("");
      setfinalPrice(""); 
      seterror("Error: Discount percentage too high");
    }
  }

  const saveCalculation = () => {
    setId(id+1);
    setHistory([{
      id: id,
      originalPrice: originalPrice,
      finalPrice: finalPrice,
      discountPercentage: discountPercentage
    }, ...History]);
    seterror("")
    setyouSave("");
    setfinalPrice(""); 
    onChangeDiscountPerdentage("");
    onChangeOriginalPrice("");
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
            <Button title="History" color="#000"
              onPress={() => {
                navigation.navigate('History', {
                History: History
                });
              }}
            />
      ),
    });
  });

  return(
      <View style={styles.container}>
      <View style={styles.display}>
      <View style={styles.calculations}>
        <Text style={styles.text}>{error}</Text>
        <Text style={styles.text}>You Save  {youSave}</Text>
        <Text style={styles.text}>Final Price  {finalPrice}</Text>
      </View>
        <TextInput 
        style={styles.input} 
        value={originalPrice}
        placeholder="Original Price"
        keyboardType='numeric'
        onChangeText={text => onChangeOriginalPrice(text)} />
        <TextInput 
        style={styles.input} 
        value={discountPercentage}
        placeholder="Discount Percentage"
        keyboardType='numeric'
        onChangeText={text => onChangeDiscountPerdentage(text)} />
        <View style={styles.buttons}>
          <Button  onPress={calcDiscount} color="#000" title="Calculate" /> 
          <Text></Text>
          <Button disabled={youSave.length <= 0} onPress={saveCalculation} color="#000" title="Save" /> 
        </View>
      </View>
      </View> 
  );
}

const CalculationHistory = ({route, navigation}) => {
  const data = route.params.History;
  const [history, setHistory] = useState(data);

  const handleRemove = (id) => {
    const list = history.filter(item => item.id !== id)
    setHistory(list);
  }

  const clearHistory = () => {
    setHistory([])
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
            <Button title="Empty" color="#000"
              onPress={()=>{
                Alert.alert(
                  'Confirm',
                  'Clear history?',
                  [
                    {text: 'Exit'},
                    {text: 'Clear', onPress: clearHistory},
                  ],
                  { cancelable: false }
                )
              }}
            />
      ),
      headerLeft: () => (
            <Button title="Back" color="#000"
              onPress={() => {
                navigation.navigate('Calculation', {
                history: history
                });
              }}
            />
      ),
    });
  })

  return(
      <View style={styles.container}> 
      <DataTable >
        <DataTable.Header >
          <DataTable.Title style={{flex: 2.5}}> Original Price </DataTable.Title>
          <DataTable.Title style={{flex: 1.5}}> Discount </DataTable.Title>
          <DataTable.Title style={{flex: 1.5}}> Final Price </DataTable.Title>
          <DataTable.Title  > Remove </DataTable.Title>
        </DataTable.Header>
        
        {history.map(mem => 
            <DataTable.Row key={mem.id}>
              <DataTable.Title style={{flex: 2.5}}> {mem.originalPrice} </DataTable.Title>
              <DataTable.Title style={{flex: 1.5}}> {mem.discountPercentage} </DataTable.Title>
              <DataTable.Title style={{flex: 1.5}}> {mem.finalPrice} </DataTable.Title>
              <DataTable.Cell >
                <Text>
                  <Button onPress={() => handleRemove(mem.id)} title="x" />
                </Text>
              </DataTable.Cell>

            </DataTable.Row>
        )}
      </DataTable>
      </View> 
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Calculation" component={Calculation}  options={{headerStyle: {backgroundColor: 'grey'}}} />
        <Stack.Screen name="History" component={CalculationHistory} options={{headerStyle: {backgroundColor: 'grey'}}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'yellow',
    fontFamily: 'sansSerif'
  },
  display: {
    flex: 1,
    justifyContent: "center"
  },
  input: {
    height: 60,
    padding: 20,
    marginBottom: 10,
    fontSize: 18,
    backgroundColor: 'white',
    width: 300,
    color: 'black',
    borderRadius: 5
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: 'black',
    fontWeight: "bold"
  },
  calculations: {
    marginBottom: 30,
  },
  buttons: {
    marginTop: 15,
    width: 100,
    marginLeft: '25%'
  },
});
