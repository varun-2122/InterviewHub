import { resolveCandidateInfo, groupMeetingsByStatus } from './coreUtils';

describe('coreUtils', () => {
  describe('resolveCandidateInfo', () => {
    const mockUsers: any[] = [
      {
        clerkId: 'user1',
        name: 'John Doe',
        image: 'https://example.com/john.png',
      },
      {
        clerkId: 'user2',
        name: 'Jane Smith',
        // no image
      }
    ];

    it('returns the candidate info when found', () => {
      const result = resolveCandidateInfo(mockUsers, 'user1');
      expect(result).toEqual({
        fullName: 'John Doe',
        avatarUrl: 'https://example.com/john.png',
        letters: 'JD',
      });
    });

    it('returns fallback info when candidate not found', () => {
      const result = resolveCandidateInfo(mockUsers, 'unknown');
      expect(result).toEqual({
        fullName: 'Unknown User',
        avatarUrl: '',
        letters: 'CD',
      });
    });

    it('generates letters correctly for single name', () => {
      const mockSingleName = [{ clerkId: 'user3', name: 'John' }];
      const result = resolveCandidateInfo(mockSingleName, 'user3');
      expect(result.letters).toEqual('J');
    });
  });

  describe('groupMeetingsByStatus', () => {
    it('groups meetings by status', () => {
      const mockMeetings: any[] = [
        { _id: '1', status: 'upcoming' },
        { _id: '2', status: 'completed' },
        { _id: '3', status: 'upcoming' },
        { _id: '4', status: 'succeeded' },
      ];

      const result = groupMeetingsByStatus(mockMeetings);
      expect(result.upcoming.length).toBe(2);
      expect(result.completed.length).toBe(1);
      expect(result.succeeded.length).toBe(1);
      expect(result.failed).toBeUndefined();
    });

    it('handles empty meetings array', () => {
      const result = groupMeetingsByStatus([]);
      expect(result).toEqual({});
    });
  });
});
