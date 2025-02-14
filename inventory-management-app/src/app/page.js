'use client'

import { useState, useEffect, useRef } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  
}


export default function Home() {
  // We'll add our component logic here
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchItem, setSearchItem] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [highlightedItem, setHighlightedItem] = useState(null)
  const itemRefs = useRef({})

const updateInventory = async () => {
  const snapshot = query(collection(firestore, 'inventory'))
  const docs = await getDocs(snapshot)
  const inventoryList = []
  docs.forEach((doc) => {
    inventoryList.push({ name: doc.id, ...doc.data() })
  })
  setInventory(inventoryList)
}

useEffect(() => {
  updateInventory()
}, [])

const addItem = async (item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
    await setDoc(docRef, { quantity: quantity + 1 })
  } else {
    await setDoc(docRef, { quantity: 1 })
  }
  await updateInventory()
}

const searchInventory = (item) => {
  const foundItem = inventory.find(
    (inventoryItem) => inventoryItem.name.toLowerCase() === item.toLowerCase()
  );
  
  if (foundItem) {
    return { name: foundItem.name, quantity: foundItem.quantity, exists: true };
  } else {
    return { name: item, exists: false };
  }
}

const handleSearch = () => {
  const result = searchInventory(searchItem);
  setSearchResult(result);
  if (result.exists) {
    setHighlightedItem(result.name);
    itemRefs.current[result.name]?.scrollIntoView({ behavior: 'smooth' });
  } else {
    setHighlightedItem(null);
  }
}

const removeItem = async (item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
    if (quantity === 1) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, { quantity: quantity - 1 })
    }
  }
  await updateInventory()
    
}
const addQuant = async(item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
  }
  await updateInventory()

}

const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)
  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack direction="row" width="100%"  spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName.toLowerCase())
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box width="100%" maxWidth="800px" mb={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button variant="contained" onClick={handleOpen}>
            Add New Item
          </Button>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Search"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Stack>
        </Stack>
      </Box>
      {searchResult && (
        <Typography variant="body1">
          {searchResult.exists 
            ? `Found!`
            : `${searchResult.name} does not exist in the inventory`}
        </Typography>
      )}

      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              ref={el => itemRefs.current[name] = el}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={highlightedItem === name ? '#FFFF00' : '#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => addQuant(name) }>
                Add
              </Button>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
  
}