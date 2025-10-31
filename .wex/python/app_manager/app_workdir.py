from __future__ import annotations

from typing import TYPE_CHECKING

from wexample_wex_addon_dev_python.workdir.python_workdir import PythonWorkdir

if TYPE_CHECKING:
    from wexample_filestate.config_option.mixin.item_config_option_mixin import (
        ItemTreeConfigOptionMixin,
    )


class AppWorkdir(PythonWorkdir):
    def _create_package_name_snake(self, option: ItemTreeConfigOptionMixin) -> str:
        # Might be automated.
        return "syrtis_core"
