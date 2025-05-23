from dataclasses import dataclass
from datetime import datetime
from typing import List, TypedDict, Literal

from mhq.store.models import EntityType
from mhq.store.models.incidents.enums import IncidentSource, IncidentType


@dataclass
class BaseSetting:
    pass


@dataclass
class ConfigurationSettings:
    entity_id: str
    entity_type: EntityType
    specific_settings: BaseSetting
    updated_by: str
    created_at: datetime
    updated_at: datetime


@dataclass
class IncidentSettings(BaseSetting):
    title_filters: List[str]


@dataclass
class ExcludedPRsSetting(BaseSetting):
    excluded_pr_ids: List[str]


@dataclass
class IncidentTypesSetting(BaseSetting):
    incident_types: List[IncidentType]


@dataclass
class IncidentSourcesSetting(BaseSetting):
    incident_sources: List[IncidentSource]


@dataclass
class DefaultSyncDaysSetting(BaseSetting):
    default_sync_days: int


class IncidentPRFilter(TypedDict):
    field: Literal["title", "head_branch"]
    value: str


@dataclass
class IncidentPRsSetting(BaseSetting):
    include_revert_prs: bool
    filters: List[IncidentPRFilter]


# ADD NEW SETTING CLASS HERE

# Sample Future Settings
# @dataclass
# class PRSettings(BaseSetting):
#     number_filters: List[str]
#     merge_time: List[str]
