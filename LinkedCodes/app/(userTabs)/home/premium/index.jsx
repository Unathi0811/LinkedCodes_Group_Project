import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'

// our benefits, what they get when they upgrade, how wmuch it is per year/
//headerShown: true
//a card with the following, premium infraSmart
//Your plan will automatically renew on ...... . You will be charged R800/year

//a long card with the following
//You will get access to premium features, including
//  - 24/7 support
//  -  priority to the app without
//  -  1 verified premium account
//  -  cancel anytime
// a button to proceed to checkout
//a button to cancel
const Index = () => {
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

export default Index

