using Frontend.Vanilla.Core.Patterns;

namespace Frontend.Vanilla.Core.Configuration;

/// <summary>
/// Creates configuration instance from deserialized DTO.
/// It can be done to create completely different object, apply some post-processing or just validation.
/// </summary>
internal interface IConfigurationFactory<TConfiguration, TDto>
    where TDto : class
{
    WithWarnings<TConfiguration> Create(TDto configDto);
}

internal abstract class SimpleConfigurationFactory<TConfiguration, TDto> : IConfigurationFactory<TConfiguration, TDto>
    where TConfiguration : class
    where TDto : class
{
    WithWarnings<TConfiguration> IConfigurationFactory<TConfiguration, TDto>.Create(TDto configDto)
        => Create(configDto).WithWarnings();

    public abstract TConfiguration Create(TDto configDto);
}

/// <summary>Default factory to be used when <typeparamref name="TDto" /> implements <typeparamref name="TConfiguration" />.</summary>
internal sealed class PassThroughConfigurationFactory<TConfiguration, TDto> : SimpleConfigurationFactory<TConfiguration, TDto>
    where TConfiguration : class
    where TDto : class, TConfiguration
{
    public override TConfiguration Create(TDto configDto)
        => configDto;
}

/// <summary>Configuration factory which creates an instance using specified builder.</summary>
internal sealed class ConfigurationBuilderFactory<TConfiguration, TBuilder> : SimpleConfigurationFactory<TConfiguration, TBuilder>
    where TConfiguration : class
    where TBuilder : class, IConfigurationBuilder<TConfiguration>
{
    public override TConfiguration Create(TBuilder builder)
        => builder.Build();
}
