import { User, newUser, TypingResult, TrackTypingRecord } from '../interfaces'

// const getLocalUser = () => {
//     try {

//         const user: User = JSON.parse(localStorage.getItem('user') || JSON.stringify(newUser))
//         return user
//     } catch (e) {
//         throw Error(`Error getting user: ${e}`)
//     }
// }

const saveTrackTypingRecord = (trackId: number, result: TypingResult) => {
    const record: TrackTypingRecord = {
        trackId: trackId,
        result: result,
        timestamp: new Date().toISOString()
    }

    try {

        const user: User = JSON.parse(localStorage.getItem('user') || JSON.stringify(newUser))

        if (!user.typingRecords) {
            user.typingRecords = []
        }
        user.typingRecords.push(record)

        if (!user.completedTrackIds) {
            user.completedTrackIds = []
        }
        if (!user.completedTrackIds.includes(trackId)) {
            user.completedTrackIds.push(trackId)
        }

        localStorage.setItem('user', JSON.stringify(user))
    } catch (e) {
        throw Error(`Error saving record: ${e}`)
    }

}

const dataProvider = { saveTrackTypingRecord }
export default dataProvider