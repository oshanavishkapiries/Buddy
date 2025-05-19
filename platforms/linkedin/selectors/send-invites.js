/**
 * Selectors for LinkedIn send-invites functionality
 */
const selectors = {
    // Navigation selectors
    followersLink: 'a[href*="search/results/people/?connectionOf"]',

    // Button selectors
    connectButton: 'button[aria-label*="Invite"][aria-label*="to connect"]',
    followButton: 'button[aria-label*="Follow"]',
    showMoreButton: 'button.artdeco-pagination__button--next',

    // Popup selectors
    popupContainer: 'div[data-test-modal-id="send-invite-modal"]',
    popupSendWithoutNote: 'button[aria-label="Send without a note"]',
    popupAddNote: 'button[aria-label="Add a note"]',
    popupClose: 'button.artdeco-modal__dismiss'
};

module.exports = selectors; 