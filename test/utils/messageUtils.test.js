const { getUsersFromMention, botWasMentioned } = require('../../utils/messageUtils');

const client = {
    user: {
        id: '123',
    },
    users: {
        cache: {
            get: () => { return { id: '123' }; }
        }
    }
}

const messageWithoutMentions = {
    content: '!test',
}

const messageWithANonMatchingUser = {
    content: '!test @user',
    mentions: {
        users: [
            { id: '456' }
        ]
    }
}

const message = {
    content: '!test @user @anotherUser',
    mentions: {
        users: [
            { id: '123' },
            { id: '456' }
        ]
    }
}

const expected = [
    { id: '123' }, { id: '123' }
]

// -------- getUsersFromMention ----------
test('getUsersFromMention() - no message', () => {
	expect(getUsersFromMention(client, null)).toEqual([]);
});


test('getUsersFromMention() - no mentions', () => {
	expect(getUsersFromMention(client, messageWithoutMentions)).toEqual([]);
});

test('getUsersFromMention() - mentions', () => {
    expect(getUsersFromMention(client, message)).toEqual(expected);
});

// -------- botWasMentioned ----------
test('botWasMentioned() - no message', () => {
    expect(botWasMentioned(client, null)).toBe(false);
});

test('botWasMentioned() - no mentions', () => {
    expect(botWasMentioned(client, messageWithoutMentions)).toBe(false);
});

test('botWasMentioned() - mentions', () => {
    expect(botWasMentioned(client, message)).toBe(true);
});

test('botWasMentioned() - mentions - non-matching user', () => {
    const client = {
        user: {
            id: 'wrongId',
        },
        users: {
            cache: {
                get: () => { return { id: '123' }; }
            }
        }
    }
    expect(botWasMentioned(client, messageWithANonMatchingUser)).toBe(false);
});

