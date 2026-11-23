import {
  type InfinityParticipant,
  type ParticipantID,
  ParticipantActivities,
  registerPlugin
} from '@pexip/plugin-api'

const PLUGIN_VERSION = 0
const EMPTY = 0

// ADPs that are currently being dialed, indexed by participant UUID
const callingAdps = new Map<ParticipantID, InfinityParticipant>()
// ADPs that failed to connect, indexed by URI
const pendingAdps = new Map<string, InfinityParticipant>()

const plugin = await registerPlugin({
  id: 'plugin-retry-adp',
  version: PLUGIN_VERSION
})

// An ADP trying to connect (it could also be an outgoing call)
const isConnectingAdp = (participant: InfinityParticipant): boolean =>
  participant.serviceType === 'connecting' &&
  participant.protocol === 'sip' &&
  participant.vendor === 'Unknown'

const handleParticipantUpdate = (participant: InfinityParticipant): void => {
  if (isConnectingAdp(participant)) {
    callingAdps.set(participant.uuid, participant)
  } else if (participant.serviceType !== 'connecting') {
    callingAdps.delete(participant.uuid)
    pendingAdps.delete(participant.uri)
  }
}

const handleParticipantLeave = async (
  participant: InfinityParticipant
): Promise<void> => {
  if (callingAdps.delete(participant.uuid)) {
    pendingAdps.set(participant.uri, participant)
    await plugin.ui.showToast({
      message: `Failed the dial out to ${participant.uri}`
    })
  }
}

plugin.events.participantsActivities.add((activities) => {
  for (const { activity } of activities) {
    if (activity.type === ParticipantActivities.Leave) {
      handleParticipantLeave(activity.participant).catch(console.error)
    } else {
      handleParticipantUpdate(activity.participant)
    }
  }
})

const button = await plugin.ui.addButton({
  position: 'toolbar',
  icon: 'IconParticipant',
  tooltip: 'Pending ADPs',
  roles: ['chair']
})

button.onClick.add(async () => {
  if (pendingAdps.size === EMPTY) {
    await plugin.ui.showPrompt({
      title: 'No pending ADP',
      description:
        "There isn't any pending ADP (Automatically Dialed Participant) request.",
      prompt: {
        primaryAction: 'Close'
      }
    })
  } else {
    const form = await plugin.ui.addForm({
      title: 'Pending ADPs',
      description:
        'Pending ADPs (Automatically Dialed Participant) detected. Do you want to retry to dial the participant?',
      form: {
        elements: {
          adp: {
            type: 'select',
            name: 'Select ADP',
            options: [...pendingAdps.keys()].map((uri) => ({
              id: uri,
              label: uri
            }))
          }
        },
        submitBtnTitle: 'Dial'
      }
    })
    form.onInput.add((input) => {
      if (pendingAdps.delete(input.adp)) {
        plugin.ui
          .showToast({ message: `Calling to ${input.adp}` })
          .catch(console.error)
        plugin.conference
          .dialOut({
            protocol: 'sip',
            role: 'GUEST',
            destination: input.adp
          })
          .catch(console.error)
      }
      form.remove().catch(console.error)
    })
  }
})
