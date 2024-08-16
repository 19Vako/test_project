import React, { createContext, useState, useContext, ReactNode } from 'react';

type Block = {
  id: number;
  width: number;
  height: number;
};

type BlocksContextType = {
  blocks: Block[];
  addBlock: (block: Block) => void;
  updateBlock: (updatedBlock: Block) => void;
  deleteBlock: (id: number) => void;
};

const BlocksContext = createContext<BlocksContextType | undefined>(undefined);

export const BlocksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, width: 1, height: 1 },
    { id: 2, width: 2, height: 1 },
    { id: 3, width: 1, height: 2 },
    { id: 4, width: 1, height: 1 },
    { id: 5, width: 1, height: 1 },
    { id: 6, width: 1, height: 1 },
    { id: 7, width: 1, height: 2 },
    { id: 8, width: 1, height: 1 },
    { id: 9, width: 1, height: 1 },
    { id: 10, width: 1, height: 1 },
  ]);

  const addBlock = (block: Block) => {
    setBlocks(prevBlocks => [...prevBlocks, block]);
  };

  const updateBlock = (updatedBlock: Block) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block => (block.id === updatedBlock.id ? updatedBlock : block))
    );
  };

  const deleteBlock = (id: number) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
  };

  return (
    <BlocksContext.Provider value={{ blocks, addBlock, updateBlock, deleteBlock }}>
      {children}
    </BlocksContext.Provider>
  );
};

export const useBlocks = () => {
  const context = useContext(BlocksContext);
  if (!context) {
    throw new Error('useBlocks must be used within a BlocksProvider');
  }
  return context;
};
