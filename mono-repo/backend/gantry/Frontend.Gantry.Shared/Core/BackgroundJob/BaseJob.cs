using System;
using System.Threading.Tasks;
using Frontend.Gantry.Shared.Core.Common.Enums;
using Microsoft.Extensions.Logging;

namespace Frontend.Gantry.Shared.Core.BackgroundJob
{
    public interface IJob
    {
        public void Start();
        public void Stop();
        public JobStatus Status { get; }
    }

    public abstract class BaseJob : IJob
    {
        protected ILogger Log { get; }
        public JobStatus Status { get; protected set; } = JobStatus.Idle;

        protected BaseJob(ILogger log)
        {
            Log = log;
        }

        public void Start()
        {
            if (Status == JobStatus.Running)
            {
                var message = $"Job \"{GetType().Name}\": already running.";

                Log.LogError(message);
                throw new Exception(message);
            }

            DoPreWorkBeforeOwnThreadStarts();

            Task.Run(async () =>
            {
                try
                {
                    Status = JobStatus.Running;
                    await DoWorkInOwnThread();
                }
                catch (Exception e)
                {
                    Log.LogError(e, e.Message);
                    Status = JobStatus.Error;
                    throw;
                }

                Status = JobStatus.Finished;
            });
        }

        public void Stop()
        {
            Log.LogInformation($"Job \"{GetType().Name}\" stopping");

            StoppingDoWork();

            Status = JobStatus.Idle;

            Log.LogInformation($"Job \"{GetType().Name}\" stopped");
        }

        protected virtual void DoPreWorkBeforeOwnThreadStarts() { }
        protected abstract Task DoWorkInOwnThread();
        protected abstract void StoppingDoWork();
    }
}