import React from 'react';
import {useState} from 'react';
import {
  Appbar,
  Button,
  Dialog,
  FAB,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import style from './style';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker';
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';

export default function Details({navigation}) {
  const {selectedTodo} = useSelector(state => state.homeState);
  const isAdd = JSON.stringify(selectedTodo) === '{}';
  const {goBack} = navigation;
  const [dialogVisible, setDialogVisible] = useState(false);
  const {bottom} = useSafeAreaInsets();
  const [dateVisible, setDateVisible] = useState(false);
  const [remindAt, setRemindAt] = useState(
    selectedTodo?.remindAt?.toDate() ?? new Date(),
  );
  const [isDateModified, setsDateModified] = useState(
    !isAdd || (!isAdd && selectedTodo?.remindAt?.toDate()),
  );

  const [todoText, setTodoText] = useState(selectedTodo.title ?? '');

  const deleteTodo = () => {
    firestore()
      .collection('todo')
      .doc(selectedTodo.id)
      .delete()
      .then(() => {
        goBack();
      });
  };

  const onPressDelete = () => {
    if (isAdd) {
      goBack();
    } else {
      deleteTodo();
    }
  };

  const setTodoList = async souldAddCalendar => {
    const content = {
      title: todoText,
      remindAt,
    };
    if (souldAddCalendar || !isAdd) {
      content.calendarId = saveToCalendar();
    }
    if (isAdd) {
      firestore()
        .collection('todo')
        .add({
          ...content,
          createdAt: new Date(),
        })
        .then(() => {
          goBack();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      firestore()
        .collection('todo')
        .doc(selectedTodo.id)
        .set({...content})
        .then(() => {
          goBack();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const onPressBack = async () => {
    goBack();
  };

  const AddEventToCalendarOption = () => {
    return (
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => {
            setDialogVisible(false);
          }}>
          <Dialog.Content>
            <Text>Save To Calendar?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setTodoList(true);
                // saveToCalendar();
              }}>
              Save To Calendar
            </Button>
            <Button onPress={() => setTodoList()}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };
  const saveToCalendar = async () => {
    const details = {
      startDate: moment(remindAt).toISOString(),
      endDate: moment(remindAt).add(1, 'hour').toISOString(),
    };
    if (!isAdd && selectedTodo?.eventId) {
      details.id = selectedTodo?.eventId;
    }
    await RNCalendarEvents.requestPermissions(false);
    return await RNCalendarEvents.saveEvent(todoText, {
      startDate: moment(remindAt).toISOString(),
      endDate: moment(remindAt).add(1, 'hour').toISOString(),
    });
  };

  const onPressSave = () => {
    if (selectedTodo.title !== todoText || isDateModified) {
      setDialogVisible(true);
    } else {
      setTodoList();
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={onPressBack} />
        <Appbar.Content title="Details" />
        <Text>
          {isDateModified && moment(remindAt).format('D/M/Y hh:mm a')}
        </Text>
        <Appbar.Action
          icon={isDateModified ? 'bell' : 'bell-plus-outline'}
          onPress={() => {
            setDateVisible(true);
          }}
        />
        {isDateModified && <Appbar.Action icon="check" onPress={onPressSave} />}
      </Appbar.Header>
      <TextInput
        value={todoText}
        style={[style.textInput, {marginBottom: bottom}]}
        multiline
        placeholder="Input your text here..."
        onChangeText={text => {
          setTodoText(text);
        }}
      />
      <FAB
        mode="flat"
        size="medium"
        icon="delete"
        onPress={onPressDelete}
        style={style.fab}
      />
      <DatePicker
        modal
        open={dateVisible}
        date={remindAt}
        mode="datetime"
        onConfirm={date => {
          setRemindAt(date);
          setDateVisible(false);
          setsDateModified(true);
        }}
        onCancel={() => setDateVisible(false)}
        minimumDate={new Date()}
      />
      <AddEventToCalendarOption />
    </>
  );
}
