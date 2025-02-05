/*
 * Wire
 * Copyright (C) 2022 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import {APIClient} from '@wireapp/api-client/lib/APIClient';
import {QualifiedUserClients, UserClients} from '@wireapp/api-client/lib/conversation';
import {QualifiedId, QualifiedUserPreKeyBundleMap, UserPreKeyBundleMap} from '@wireapp/api-client/lib/user';

import {getQualifiedPreKeyBundle, getPreKeyBundleMap} from './PreKeyBundle/PreKeyBundle';

import {getConversationQualifiedMembers} from '../../../conversation/ConversationService/Utility/getConversationQualifiedMembers';
import {isQualifiedUserClients, isUserClients} from '../../../util';

interface GetRecipientsForConversationQualifiedParams {
  apiClient: APIClient;
  conversationId: QualifiedId;
  userIds?: QualifiedId[] | QualifiedUserClients;
}

const getQualifiedRecipientsForConversation = async ({
  apiClient,
  conversationId,
  userIds,
}: GetRecipientsForConversationQualifiedParams): Promise<QualifiedUserClients | QualifiedUserPreKeyBundleMap> => {
  if (isQualifiedUserClients(userIds)) {
    return userIds;
  }

  const recipientIds = userIds || (await getConversationQualifiedMembers({apiClient: apiClient, conversationId}));
  return getQualifiedPreKeyBundle({apiClient, userIds: recipientIds});
};

interface GetRecipientsForConversationParams {
  apiClient: APIClient;
  conversationId: QualifiedId;
  userIds?: string[] | UserClients;
}
const getRecipientsForConversation = async ({
  apiClient,
  conversationId,
  userIds,
}: GetRecipientsForConversationParams): Promise<UserClients | UserPreKeyBundleMap> => {
  if (isUserClients(userIds)) {
    return userIds;
  }
  return getPreKeyBundleMap({
    apiClient: apiClient,
    conversationId,
    userIds,
  });
};

export {getQualifiedRecipientsForConversation, getRecipientsForConversation};
