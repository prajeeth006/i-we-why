using System.Threading.Tasks;

namespace Frontend.Vanilla.Features.Ioc;

/// <summary>
/// Represents tasks that should run as part of a Web application bootstrapping
/// sequence (after the dependency injection container is constructed and populated,
/// but before any application logic runs).
/// For convenience see <see cref="LambdaBootTask" />.
/// </summary>
public interface IBootTask
{
    /// <summary>
    /// Executes the boot task as part of the application bootstrap sequence.
    /// </summary>
    Task ExecuteAsync();
}
