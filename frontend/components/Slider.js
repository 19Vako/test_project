import React, { useState, useContext, useRef } from 'react';
import { View, Dimensions, Modal, Text, TouchableOpacity, StyleSheet, FlatList, Pressable } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ValueContext } from '../context';

const { width } = Dimensions.get('window');

export default function Slider({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const { items, setItems } = useContext(ValueContext);

  const flatListRef = useRef(null);
  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const handleItemPress = (item, event) => {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedItem(item);
    setModalPosition({ top: pageY, left: pageX });
    setModalVisible(true);
  };

  const getSlides = () => {
    const slides = [];
    const slideWidth = 2;
    const slideHeight = 4;
    const cellWidth = (width - 40) / slideWidth;
    const cellHeight = (650 - 40) / slideHeight;
    const horizontalMargin = 10;
    const verticalMargin = 10;

    let currentSlide = [];
    let currentGrid = Array(slideHeight).fill(null).map(() => Array(slideWidth).fill(null));

    items.forEach((item, index) => {
      const itemWidth = item.width * (cellWidth + horizontalMargin);
      const itemHeight = item.height * (cellHeight + verticalMargin);
      let placed = false;

      for (let r = 0; r < slideHeight; r++) {
        for (let c = 0; c < slideWidth; c++) {
          if (
            r + item.height <= slideHeight &&
            c + item.width <= slideWidth &&
            currentGrid.slice(r, r + item.height).every(row => row.slice(c, c + item.width).every(cell => cell === null))
          ) {
            for (let i = r; i < r + item.height; i++) {
              for (let j = c; j < c + item.width; j++) {
                currentGrid[i][j] = `${item.id}-${i}-${j}`;
              }
            }
            currentSlide.push({
              id: `${item.id}-${index}`,
              width: itemWidth - horizontalMargin,
              height: itemHeight - verticalMargin,
              item,
            });
            placed = true;
            break;
          }
        }
        if (placed) break;
      }

      if (!placed) {
        slides.push({ key: `slide-${slides.length}`, items: currentSlide });
        currentSlide = [];
        currentGrid = Array(slideHeight).fill(null).map(() => Array(slideWidth).fill(null));

        for (let r = 0; r < slideHeight; r++) {
          for (let c = 0; c < slideWidth; c++) {
            if (
              r + item.height <= slideHeight &&
              c + item.width <= slideWidth &&
              currentGrid.slice(r, r + item.height).every(row => row.slice(c, c + item.width).every(cell => cell === null))
            ) {
              for (let i = r; i < r + item.height; i++) {
                for (let j = c; j < c + item.width; j++) {
                  currentGrid[i][j] = `${item.id}-${i}-${j}`;
                }
              }
              currentSlide.push({
                id: `${item.id}-${index}`,
                width: itemWidth - horizontalMargin,
                height: itemHeight - verticalMargin,
                item,
              });
              placed = true;
              break;
            }
          }
          if (placed) break;
        }
      }
    });

    if (currentSlide.length > 0) {
      slides.push({ key: `slide-${slides.length}`, items: currentSlide });
    }

    return slides;
  };

  const slides = getSlides();

  const GridItem = ({ width, height, item }) => (
    <View style={[styles.gridItem, { width, height }]}>
      <TouchableOpacity
        style={styles.ItemButton}
        onPress={(event) => handleItemPress(item, event)}
      >
        <SimpleLineIcons name="options-vertical" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleEdit = (item) => {
    navigation.navigate('AddEdit', { value: item });
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {items.length > 0 ? (
        <>
          <FlatList
            ref={flatListRef}
            data={slides}
            horizontal
            pagingEnabled
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                {item.items.map(gridItem => (
                  <GridItem
                    key={gridItem.id}
                    width={gridItem.width}
                    height={gridItem.height}
                    item={gridItem.item}
                  />
                ))}
              </View>
            )}
            keyExtractor={item => item.key}
            showsHorizontalScrollIndicator={false}
          />
          <View style={styles.dotsContainer}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dot, { backgroundColor: index === currentIndex ? '#3467EB' : 'gray' }]}
                onPress={() => { flatListRef.current.scrollToIndex({ index }); }}
              />
            ))}
          </View>

          {selectedItem && (
            <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
              <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
                <View style={[styles.modalContainer, {
                  position: 'absolute',
                  top: modalPosition.top - 40, 
                  left: modalPosition.left - 50, 
                }]}>
                  <TouchableOpacity style={styles.modalButton} onPress={() => handleEdit(selectedItem)}>
                    <AntDesign name="edit" size={20} color="black" />
                    <Text style={styles.title}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={() => handleDelete(selectedItem.id)}>
                    <AntDesign name="delete" size={20} color="red" />
                    <Text style={styles.titleDelete}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal>
          )}
        </>
      ) : (
        <View style={styles.container}>
          <Text style={styles.Title}>Empty</Text>
          <Text style={styles.title}>Click Add button above to add new items</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  Title: {
    marginTop: 300,
    fontSize: 40
  },
  slide: {
    paddingBottom: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 20,
    height: 650,
  },
  gridItem: {
    backgroundColor: '#E6E6E6',
    borderColor: 'black',
    margin: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 20,
    padding: 10,
  },
  ItemButton: {
    padding: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 5,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    marginTop: -10,
    marginLeft: -30,
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 10,
  },
  modalButton: {
    flexDirection: 'row',
    marginVertical: 5
  },
  titleDelete: {
    color: 'red',
    marginLeft: 10
  },
  title: {
    marginLeft: 10
  }
});
