using System;
using System.Runtime.ExceptionServices;
using System.Threading;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;

internal class TimeBasedDeserializerDecorator(DynaConEngineSettings settings, IChangesetDeserializer inner) : IChangesetDeserializer
{
    private readonly TimeSpan interval = settings.ChangesPollingInterval ?? TimeSpan.FromMinutes(1);

    public IValidChangeset Deserialize(ConfigurationResponse changesetDto, VariationHierarchyResponse contextHierarchy, ConfigurationSource source)
    {
        IValidChangeset? result = null;
        ExceptionDispatchInfo? exceptionInfo = null;
        Exception? threadAbortedException = null;

        var thread = new Thread(() =>
        {
            try
            {
                result = inner.Deserialize(changesetDto, contextHierarchy, source);
            }
            catch (ThreadAbortException ex)
            {
                threadAbortedException = ex;
            }
            catch (Exception ex)
            {
                exceptionInfo = ExceptionDispatchInfo.Capture(ex);
            }
        });
        thread.Start();

        if (!thread.Join(interval))
        {
            thread.Interrupt();
            Thread.Sleep(100); // Waiting for the threadAbortedException to be set by the Thread after aborting.

            throw new Exception(
                $"The deserialization of the changeset ({changesetDto.ChangesetId}) was aborted after the configured time {interval.ToString()} to avoid over consumption of system resources. Please check inner exception to find more about the stack trace of the aborted process.",
                threadAbortedException);
        }

        exceptionInfo?.Throw();

        return result ?? throw new VanillaBugException();
    }
}
