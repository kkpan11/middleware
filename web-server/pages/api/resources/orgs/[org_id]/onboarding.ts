import * as yup from 'yup';

import { Endpoint, nullSchema } from '@/api-helpers/global';
import { Columns, Table } from '@/constants/db';
import { OnboardingSteps } from '@/types/resources';
import { db } from '@/utils/db';

const putSchema = yup.object().shape({
  onboarding_state: yup
    .array()
    .of(yup.string().oneOf(Object.values(OnboardingSteps)).required())
    .required()
});

const pathSchema = yup.object().shape({
  org_id: yup.string().uuid().required()
});

const endpoint = new Endpoint(pathSchema);

endpoint.handle.GET(nullSchema, async (req, res) => {
  const { org_id } = req.payload;
  return res.send(await getOnBoardingState(org_id));
});

endpoint.handle.PUT(putSchema, async (req, res) => {
  const { org_id, onboarding_state } = req.payload;

  return res.send(
    await updateOnBoardingState(org_id, onboarding_state as OnboardingSteps[])
  );
});

export default endpoint.serve();

export const getOnBoardingState = async (
  org_id: string
): Promise<{ onboarding_state: OnboardingSteps[] }> => {
  const results = await db(Table.UIPreferences)
    .select(Columns[Table.UIPreferences].data)
    .where(Columns[Table.UIPreferences].entity_id, org_id);
  return results[0]?.data ?? { onboarding_state: [] };
};

export const updateOnBoardingState = async (
  org_id: ID,
  onboarding_state: OnboardingSteps[]
): Promise<{ onboarding_state: OnboardingSteps[] }> => {
  const results = await db(Table.UIPreferences)
    .insert({
      entity_type: 'ORG',
      entity_id: org_id,
      setting_type: 'ONBOARDING_STATE',
      data: {
        onboarding_state
      },
      setter_type: 'ORG'
    })
    .onConflict([
      Columns[Table.UIPreferences].setting_type,
      Columns[Table.UIPreferences].entity_type,
      Columns[Table.UIPreferences].entity_id
    ])
    .merge()
    .returning('*');
  return results[0]?.data ?? { onboarding_state: [] };
};