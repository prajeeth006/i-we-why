using System;
using System.ServiceModel;
using System.Threading;
using Moq;

namespace Frontend.Vanilla.Testing;

/// <summary>
///     Implements a fake <see cref="WcfFakeProxy" /> in order to allow unit testing of Windows Communication
///     Foundation based proxies.
/// </summary>
/// <example>
///     <code title="Usage"
///         description="In order to use this fake implementation of WcfFakeProxy, create a new class as follows:"
///         lang="CS"><![CDATA[
/// public class FakeServiceClient : WcfFakeProxy, IServiceContract
///
/// // Replace IServiceContract with your service contract interface to test.
/// // Implement the IServiceContract service contract to mimic the behavior of the real service.
/// ]]></code>
/// </example>
public abstract class WcfFakeProxy : ICommunicationObject, IDisposable
{
    private IClientChannel channel = new Mock<IClientChannel>().Object;

    /// <summary>
    ///     Gets or sets the inner channel.
    /// </summary>
    /// <value>The inner channel.</value>
    public IClientChannel InnerChannel
    {
        get => channel;
        set => channel = value ?? new Mock<IClientChannel>().Object;
    }

    /// <summary>
    ///     Occurs when the communication object completes its transition from the closing state into the closed state.
    /// </summary>
    event EventHandler ICommunicationObject.Closed
    {
        add => InnerChannel.Closed += value;
        remove => InnerChannel.Closed -= value;
    }

    /// <summary>
    ///     Occurs when the communication object first enters the closing state.
    /// </summary>
    event EventHandler ICommunicationObject.Closing
    {
        add => InnerChannel.Closing += value;
        remove => InnerChannel.Closing -= value;
    }

    /// <summary>
    ///     Occurs when the communication object first enters the faulted state.
    /// </summary>
    event EventHandler ICommunicationObject.Faulted
    {
        add => InnerChannel.Faulted += value;
        remove => InnerChannel.Faulted -= value;
    }

    /// <summary>
    ///     Occurs when the communication object completes its transition from the opening state into the opened state.
    /// </summary>
    event EventHandler ICommunicationObject.Opened
    {
        add => InnerChannel.Opened += value;
        remove => InnerChannel.Opened -= value;
    }

    /// <summary>
    ///     Occurs when the communication object first enters the opening state.
    /// </summary>
    event EventHandler ICommunicationObject.Opening
    {
        add => InnerChannel.Opening += value;
        remove => InnerChannel.Opening -= value;
    }

    /// <summary>
    ///     Causes a communication object to transition immediately from its current state into the closed state.
    /// </summary>
    public void Abort()
    {
        channel.Abort();
        State = CommunicationState.Faulted;
    }

    /// <summary>
    ///     Causes a communication object to transition from its current state into the closed state.
    /// </summary>
    /// <exception cref="System.ServiceModel.CommunicationObjectFaultedException">
    ///     The Close method
    ///     was called on an object in the <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    /// <exception cref="System.TimeoutException">
    ///     The default close timeout elapsed before the <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was able to close gracefully.
    /// </exception>
    public void Close()
    {
        channel.Close();
        State = CommunicationState.Closed;
    }

    /// <summary>
    ///     Causes a communication object to transition from its current state into the closed state.
    /// </summary>
    /// <param name="timeout">
    ///     The Timespan that specifies how long the send operation has to complete
    ///     before timing out.
    /// </param>
    /// <exception cref="System.ServiceModel.CommunicationObjectFaultedException">
    ///     The Close method
    ///     was called on an object in the <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    /// <exception cref="System.TimeoutException">
    ///     The timeout elapsed before the <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was able to close gracefully.
    /// </exception>
    public void Close(TimeSpan timeout)
    {
        channel.Close(timeout);
        State = CommunicationState.Closed;
    }

    /// <summary>
    ///     Begins an asynchronous operation to close a communication object.
    /// </summary>
    /// <returns>
    ///     The <see cref="System.IAsyncResult" /> that references the asynchronous close operation.
    /// </returns>
    /// <param name="callback">
    ///     The <see cref="System.AsyncCallback" /> delegate that receives notification of the completion
    ///     of the asynchronous close operation.
    /// </param>
    /// <param name="state">
    ///     An object, specified by the application, that contains state information associated with the asynchronous
    ///     close operation.
    /// </param>
    /// <exception cref="System.ServiceModel.CommunicationObjectFaultedException">
    ///     The BeginClose method
    ///     was called on an object in the <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    /// <exception cref="System.TimeoutException">
    ///     The default timeout elapsed before the <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was able to close gracefully.
    /// </exception>
    public IAsyncResult BeginClose(AsyncCallback callback, object state)
    {
        channel.BeginClose(callback, state);
        State = CommunicationState.Closing;

        return new CompletedAsynchronousResult(state);
    }

    /// <summary>
    ///     Begins an asynchronous operation to close a communication object with a specified timeout.
    /// </summary>
    /// <returns>
    ///     The <see cref="System.IAsyncResult" /> that references the asynchronous close operation.
    /// </returns>
    /// <param name="timeout">The Timespan that specifies how long the send operation has to complete before timing out.</param>
    /// <param name="callback">
    ///     The <see cref="System.AsyncCallback" /> delegate that receives notification of the completion of
    ///     the asynchronous close operation.
    /// </param>
    /// <param name="state">
    ///     An object, specified by the application, that contains state
    ///     information associated with the asynchronous close operation.
    /// </param>
    /// <exception cref="System.ServiceModel.CommunicationObjectFaultedException">
    ///     The BeginClose method
    ///     was called on an object in the <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    /// <exception cref="System.TimeoutException">
    ///     The specified timeout elapsed before the <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was able to close gracefully.
    /// </exception>
    public IAsyncResult BeginClose(TimeSpan timeout, AsyncCallback callback, object state)
    {
        channel.BeginClose(timeout, callback, state);
        State = CommunicationState.Closing;

        return new CompletedAsynchronousResult(state);
    }

    /// <summary>
    ///     Completes an asynchronous operation to close a communication object.
    /// </summary>
    /// <param name="result">
    ///     The <see cref="System.IAsyncResult" /> that is returned by a call to the
    ///     <c>BeginClose</c> method.
    /// </param>
    /// <exception cref="System.ServiceModel.CommunicationObjectFaultedException">
    ///     The <c>BeginClose</c> method
    ///     was called on an object in the <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    /// <exception cref="System.TimeoutException">
    ///     The timeout elapsed before the <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was able to close gracefully.
    /// </exception>
    public void EndClose(IAsyncResult result)
    {
        channel.EndClose(result);
        State = CommunicationState.Closed;
    }

    /// <summary>
    ///     Causes a communication object to transition from the created state into the opened state.
    /// </summary>
    /// <exception cref="System.ServiceModel.CommunicationException">
    ///     The <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was unable to be opened and has entered the <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    /// <exception cref="System.TimeoutException">
    ///     The default open timeout elapsed before the <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was able to enter the <see cref="F:System.ServiceModel.CommunicationState.Opened" /> state and has entered the
    ///     <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    public void Open()
    {
        channel.Open();
        State = CommunicationState.Opened;
    }

    /// <summary>
    ///     Causes a communication object to transition from the created state into the opened state within a specified
    ///     interval of time.
    /// </summary>
    /// <param name="timeout">The Timespan that specifies how long the send operation has to complete before timing out.</param>
    /// <exception cref="System.ServiceModel.CommunicationException">
    ///     The <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was unable to be opened and has entered the <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    /// <exception cref="System.TimeoutException">
    ///     The specified timeout elapsed before the <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was able to enter the <see cref="F:System.ServiceModel.CommunicationState.Opened" /> state and has entered the
    ///     <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    public void Open(TimeSpan timeout)
    {
        channel.Open(timeout);
        State = CommunicationState.Opened;
    }

    /// <summary>
    ///     Begins an asynchronous operation to open a communication object.
    /// </summary>
    /// <returns>
    ///     The <see cref="System.IAsyncResult" /> that references the asynchronous open operation.
    /// </returns>
    /// <param name="callback">
    ///     The <see cref="System.AsyncCallback" /> delegate that receives notification of the completion of the
    ///     asynchronous open operation.
    /// </param>
    /// <param name="state">
    ///     An object, specified by the application, that contains state information
    ///     associated with the asynchronous open operation.
    /// </param>
    /// <exception cref="System.ServiceModel.CommunicationException">
    ///     The <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was unable to be opened and has entered the <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    /// <exception cref="System.TimeoutException">
    ///     The default open timeout elapsed before the <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was able to enter the <see cref="F:System.ServiceModel.CommunicationState.Opened" /> state and has entered the
    ///     <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    public IAsyncResult BeginOpen(AsyncCallback callback, object state)
    {
        channel.BeginOpen(callback, state);
        State = CommunicationState.Opening;

        return new CompletedAsynchronousResult(state);
    }

    /// <summary>
    ///     Begins an asynchronous operation to open a communication object within a specified interval of time.
    /// </summary>
    /// <returns>
    ///     The <see cref="System.IAsyncResult" /> that references the asynchronous open operation.
    /// </returns>
    /// <param name="timeout">
    ///     The Timespan that specifies how long the send operation has to complete
    ///     before timing out.
    /// </param>
    /// <param name="callback">
    ///     The <see cref="System.AsyncCallback" /> delegate that receives
    ///     notification of the completion of the asynchronous open operation.
    /// </param>
    /// <param name="state">
    ///     An object, specified by the application, that contains state information associated with the
    ///     asynchronous open operation.
    /// </param>
    /// <exception cref="System.ServiceModel.CommunicationException">
    ///     The <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was unable to be opened and has entered the <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    /// <exception cref="System.TimeoutException">
    ///     The specified timeout elapsed before the <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was able to enter the <see cref="F:System.ServiceModel.CommunicationState.Opened" /> state and has entered the
    ///     <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    public IAsyncResult BeginOpen(TimeSpan timeout, AsyncCallback callback, object state)
    {
        channel.BeginOpen(timeout, callback, state);
        State = CommunicationState.Opening;

        return new CompletedAsynchronousResult(state);
    }

    /// <summary>
    ///     Completes an asynchronous operation to open a communication object.
    /// </summary>
    /// <param name="result">The <see cref="System.IAsyncResult" /> that is returned by a call to the <c>BeginOpen</c> method.</param>
    /// <exception cref="System.ServiceModel.CommunicationException">
    ///     The <see cref="System.ServiceModel.ICommunicationObject" />
    ///     was unable to be opened and has entered the <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    /// <exception cref="System.TimeoutException">
    ///     The timeout elapsed before the <see cref="System.ServiceModel.ICommunicationObject" /> was able
    ///     to enter the <see cref="F:System.ServiceModel.CommunicationState.Opened" /> state and has entered the
    ///     <see cref="F:System.ServiceModel.CommunicationState.Faulted" /> state.
    /// </exception>
    public void EndOpen(IAsyncResult result)
    {
        channel.EndOpen(result);
        State = CommunicationState.Opened;
    }

    /// <summary>
    ///     Gets the current state of the communication-oriented object.
    /// </summary>
    /// <returns>
    ///     The value of the <see cref="System.ServiceModel.CommunicationState" /> of the object.
    /// </returns>
    public CommunicationState State { get; private set; }

    /// <summary>
    ///     Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
    /// </summary>
    public void Dispose()
    {
        channel.Dispose();
        State = CommunicationState.Closed;
    }

    private sealed class CompletedAsynchronousResult : IAsyncResult
    {
        private readonly object state;

        internal CompletedAsynchronousResult(object state)
        {
            this.state = state;
        }

        bool IAsyncResult.IsCompleted => true;

        WaitHandle IAsyncResult.AsyncWaitHandle => throw new NotSupportedException();

        object IAsyncResult.AsyncState => state;

        bool IAsyncResult.CompletedSynchronously => true;
    }
}
