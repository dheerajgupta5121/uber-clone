import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SocketContext } from '../Context/SocketContext'
import { CaptainDataContext } from '../Context/CaptainContext'
import axios from 'axios'

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [ride, setRide] = useState(null)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    // Join socket room and track location
    useEffect(() => {
        if (!captain?._id) return

        socket.emit('join', {
            userId: captain._id,
            userType: 'captain',
        })

        const updateLocation = () => {
            navigator.geolocation?.getCurrentPosition(position => {
                socket.emit('update-location-captain', {
                    userId: captain._id,
                    location: {
                        ltd: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                })
            })
        }

        updateLocation()
        const locationInterval = setInterval(updateLocation, 10000)

        return () => clearInterval(locationInterval)
    }, [socket, captain])

    // Listen for new ride events
    useEffect(() => {
        const handleNewRide = data => {
            setRide(data)
            setRidePopupPanel(true)
        }

        socket.on('new-ride', handleNewRide)
        return () => socket.off('new-ride', handleNewRide)
    }, [socket])

    const confirmRide = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/rides/confirm`,
                {
                    rideId: ride._id,
                    captainId: captain._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )

            if (response.status === 200) {
                setRidePopupPanel(false)
                setConfirmRidePopupPanel(true)
            }
        } catch (error) {
            console.error('Error confirming ride:', error)
            alert('Failed to confirm ride. Please try again.')
        }
    }

    // Animate ride popup
    useGSAP(() => {
        gsap.to(ridePopupPanelRef.current, {
            transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)',
        })
    }, [ridePopupPanel])

    // Animate confirm ride popup
    useGSAP(() => {
        gsap.to(confirmRidePopupPanelRef.current, {
            transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)',
        })
    }, [confirmRidePopupPanel])

    return (
        <div className="h-screen">
            <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
                <img
                    className="w-16"
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                    alt="Uber Logo"
                />
                <Link to="/captain-home" className="h-10 w-10 bg-white flex items-center justify-center rounded-full">
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className="h-3/5">
                <img
                    className="h-full w-full object-cover"
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                    alt="Map animation"
                />
            </div>

            <div className="h-2/5 p-6">
                <CaptainDetails />
            </div>

            <div ref={ridePopupPanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            <div ref={confirmRidePopupPanelRef} className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    )
}

export default CaptainHome
