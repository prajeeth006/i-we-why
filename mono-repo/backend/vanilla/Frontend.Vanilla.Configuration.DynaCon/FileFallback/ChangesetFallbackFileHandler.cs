using System;
using System.Collections.Generic;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;

namespace Frontend.Vanilla.Configuration.DynaCon.FileFallback;

/// <summary>
/// Defines specific handling of file with a fallback changeset.
/// </summary>
internal sealed class ChangesetFallbackFileHandler(TenantSettings settings, IChangesetDeserializer deserializer) : IFallbackFileDataHandler<IValidChangeset>
{
    public RootedPath? Path => settings.ChangesetFallbackFile;
    public IReadOnlyList<DynaConParameter> Parameters => settings.Parameters;

    public IValidChangeset Deserialize(FallbackDto dto)
        => deserializer.Deserialize(
            dto.Changeset ?? throw new Exception("Missing deserialized Changeset."),
            dto.ContextHierarchy ?? throw new Exception("Missing deserialized ContextHierarchy."),
            ConfigurationSource.FallbackFile);

    public FallbackDto Serialize(IValidChangeset changeset)
        => new FallbackDto
        {
            Changeset = changeset.Dto,
            ContextHierarchy = changeset.ContextHierarchy,
        };
}
