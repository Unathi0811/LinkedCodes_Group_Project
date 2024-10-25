import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'

const SupportUs = () => {
  const router = useRouter()
  return (
    <View className="flex-1 justify-center items-center align-middle">
      <Text>SupportUs</Text>
      <Link href="/(payment)/" asChild>
        <TouchableOpacity
            className="bg-[#202A44] hover:bg-[#ccc] text-white font-bold py-2 px-4 rounded-[10px] h-12 w-60 align-middle justify-center items-center"
          >
          <Text
          className="text-[#fff] font-bold text-[16px]"
          >Proceed To Payment</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

export default SupportUs