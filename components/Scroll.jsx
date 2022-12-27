import React from "react"
import { ScrollView, RefreshControl } from "react-native"

const Scroll = ({ children, refreshing, onRefresh, showScroll = false }) => {
    return (
        <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={showScroll}
            refreshControl={
                <RefreshControl
                    size={'large'}
                    color={'black'}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                />
            }>
            {children && children}
        </ScrollView>
    )
}
export default Scroll;
