import { useEffect } from 'react';

/**
 * Custom hook untuk listen ke Laravel Echo events
 * @param {string} channel - Nama channel
 * @param {string} event - Nama event
 * @param {function} callback - Callback function yang akan dipanggil saat event diterima
 */
export function useEcho(channel, event, callback) {
    useEffect(() => {
        if (!window.Echo) {
            console.error('Laravel Echo not initialized');
            return;
        }

        const echoChannel = window.Echo.channel(channel);
        
        echoChannel.listen(`.${event}`, (data) => {
            callback(data);
        });

        // Cleanup saat component unmount
        return () => {
            echoChannel.stopListening(`.${event}`);
            window.Echo.leaveChannel(channel);
        };
    }, [channel, event, callback]);
}

/**
 * Hook untuk listen multiple events pada satu channel
 * @param {string} channel - Nama channel
 * @param {Object} events - Object dengan key = event name, value = callback
 */
export function useEchoMultiple(channel, events) {
    useEffect(() => {
        if (!window.Echo) {
            console.error('Laravel Echo not initialized');
            return;
        }

        const echoChannel = window.Echo.channel(channel);
        
        // Subscribe ke semua events
        Object.entries(events).forEach(([eventName, callback]) => {
            echoChannel.listen(`.${eventName}`, callback);
        });

        // Cleanup
        return () => {
            Object.keys(events).forEach((eventName) => {
                echoChannel.stopListening(`.${eventName}`);
            });
            window.Echo.leaveChannel(channel);
        };
    }, [channel, events]);
}
