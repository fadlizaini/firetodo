import React, {useEffect, useState} from 'react';
import {Appbar, Button, Card} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {getToDoList, setSelectedToDo} from '../../redux/home.slice';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {FlatList, RefreshControl} from 'react-native';
import {PermissionsAndroid} from 'react-native';

export default function Home(props) {
  const isFocused = useIsFocused();
  const {navigation} = props;
  const dispatch = useDispatch();
  const {todo} = useSelector(state => state.homeState);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }, []);

  useEffect(() => {
    if (isFocused) {
      getToDo();
    }
  }, [isFocused]);

  const navigateToDetails = () => {
    navigation.navigate('details');
  };

  const onPressEdit = item => {
    dispatch(setSelectedToDo(item));
    navigateToDetails();
  };

  const onPressAdd = () => {
    dispatch(setSelectedToDo({}));
    navigateToDetails();
  };

  const getToDo = async () => {
    setRefreshing(true);
    await firestore()
      .collection('todo')
      .orderBy('createdAt', 'desc')
      .get()
      .then(data => {
        dispatch(
          getToDoList(
            data.docs.map(item => {
              return {
                ...item.data(),
                id: item.id,
              };
            }),
          ),
        );
      });
    setRefreshing(false);
  };

  const deleteTodo = id => {
    firestore()
      .collection('todo')
      .doc(id)
      .delete()
      .then(() => {
        getToDo();
      });
  };

  function _renderTodoCard({item}) {
    return (
      <Card key={item.id}>
        <Card.Title title={item.title} />
        <Card.Actions>
          <Button icon="delete" onPress={() => deleteTodo(item.id)}>
            Delete
          </Button>
          <Button icon="square-edit-outline" onPress={() => onPressEdit(item)}>
            edit
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  return (
    <>
      <Appbar>
        <Appbar.Content title={'Todo'} />
        <Appbar.Action icon="plus" onPress={onPressAdd} />
      </Appbar>
      <FlatList
        data={todo}
        renderItem={_renderTodoCard}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getToDo} />
        }
      />
    </>
  );
}
