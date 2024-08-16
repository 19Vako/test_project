import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, TouchableWithoutFeedback, GestureResponderEvent, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useBlocks } from '../BlocksContext'; 

const { width, height } = Dimensions.get('window');
const numColumns = 2;
const numRows = 4;
const margin = 4;
const leftPadding = 4;
const cellSize = (width - (numColumns + 1) * margin - leftPadding) / numColumns;

const Main: React.FC = ({navigation}) => {
  const { blocks, deleteBlock } = useBlocks();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);
  const [slides, setSlides] = useState<Block[][]>([]);

  useEffect(() => {
    const createSlides = (blocks: Block[]) => {
      const slides: Block[][] = [];
      let availableBlocks = [...blocks];

      while (availableBlocks.length > 0) {
        const bestFitBlocks = findOptimalBlocksForSlide(availableBlocks);
        slides.push(bestFitBlocks);
        availableBlocks = availableBlocks.filter(block => !bestFitBlocks.includes(block));
      }

      return slides;
    };

    const findOptimalBlocksForSlide = (availableBlocks: Block[]) => {
      let bestFitBlocks: Block[] = [];
      let maxFilledCells = 0;

      const findCombination = (blocks: Block[], selectedBlocks: Block[], filledCells: number) => {
        if (filledCells > numColumns * numRows) return;

        if (filledCells > maxFilledCells) {
          maxFilledCells = filledCells;
          bestFitBlocks = selectedBlocks;
        }

        for (let i = 0; i < blocks.length; i++) {
          findCombination(
            blocks.slice(i + 1),
            [...selectedBlocks, blocks[i]],
            filledCells + blocks[i].width * blocks[i].height
          );
        }
      };

      findCombination(availableBlocks, [], 0);
      return bestFitBlocks;
    };

    setSlides(createSlides(blocks));
  }, [blocks]);

  const openModal = (block: Block, event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedBlock(block);
    setModalPosition({ top: pageY + 10, left: pageX - 100 });
    setModalVisible(true);
  };

  const handleEdit = () => {
    if (selectedBlock) {
       navigation.navigate('Edit Item', { blocks, selectedBlockId: selectedBlock.id });
      setModalVisible(false);
    }
  };

  const handleDelete = () => {
    if (selectedBlock) {
      deleteBlock(selectedBlock.id);
      setModalVisible(false);
    }
  };

  const arrangeBlocksInSlide = (blocks: Block[]) => {
    const grid: (number | null)[][] = Array.from({ length: numRows }, () => Array(numColumns).fill(null));
    const arrangedBlocks: any[] = [];

    const slideWidth = width;
    const totalGridWidth = numColumns * cellSize + (numColumns + 1) * margin;
    const offsetX = (slideWidth - totalGridWidth) / 2 + leftPadding;

    for (const block of blocks) {
      let placed = false;
      for (let row = 0; row <= numRows - block.height; row++) {
        if (placed) break;
        for (let col = 0; col <= numColumns - block.width; col++) {
          let canPlace = true;
          for (let r = row; r < row + block.height; r++) {
            for (let c = col; c < col + block.width; c++) {
              if (grid[r][c] !== null) {
                canPlace = false;
                break;
              }
            }
            if (!canPlace) break;
          }

          if (canPlace) {
            for (let r = row; r < row + block.height; r++) {
              for (let c = col; c < col + block.width; c++) {
                grid[r][c] = block.id;
              }
            }

            arrangedBlocks.push({
              ...block,
              left: offsetX + col * (cellSize + margin),
              top: row * (cellSize + margin),
              width: block.width * cellSize + (block.width - 1) * margin,
              height: block.height * cellSize + (block.height - 1) * margin,
            });
            placed = true;
            break;
          }
        }
      }
    }

    return arrangedBlocks;
  };

  const calculateSlideHeight = (blocks: Block[]) => {
    const maxBlockHeight = Math.max(...blocks.map(block => block.height * cellSize + (block.height - 1) * margin));
    return maxBlockHeight + margin * 2;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {blocks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Empty </Text>
          <Text>Click Add button above to add new items</Text>
        </View>
      ) : (
        <Swiper style={styles.wrapper}>
          {slides.map((slide, slideIndex) => {
            const slideHeight = calculateSlideHeight(slide);
            return (
              <View
                key={slideIndex}
                style={[styles.slide, { height: slideHeight }]}
              >
                {arrangeBlocksInSlide(slide).map((block, index) => (
                  <View
                    key={index}
                    style={[
                      styles.square,
                      {
                        width: block.width,
                        height: block.height,
                        left: block.left,
                        top: block.top,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={(event) => openModal(block, event)}
                      style={styles.modalButton}
                    >
                      <SimpleLineIcons name="options-vertical" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            );
          })}
        </Swiper>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { top: modalPosition?.top, left: modalPosition?.left }]}>
              <TouchableOpacity style={styles.modalActionButton} onPress={handleEdit}>
                <SimpleLineIcons name="pencil" size={20} color="black" />
                <Text style={styles.modalActionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalActionButton} onPress={handleDelete}>
                <SimpleLineIcons name="trash" size={20} color="red" />
                <Text style={[styles.modalActionText, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height - 100, 
  },
  emptyText: {
    fontSize: 50,
    color: 'black',
  },
  wrapper: {
    height: height * 1.07,
    paddingTop: height * 0.01,
  },
  slide: {
    width: width,
    position: 'relative',
    height: height * 1,
  },
  square: {
    backgroundColor: '#E6E6E6',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    position: 'absolute',
    top: 10,
    right: 5,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 100,
    height: 80,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 15,
    elevation: 5,
  },
  modalActionButton: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  modalActionText: {
    fontSize: 16,
    marginLeft: 6,
  },
  deleteText: {
    color: 'red',
  },
});

export default Main;
