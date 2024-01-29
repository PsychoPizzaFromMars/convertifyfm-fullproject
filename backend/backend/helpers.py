def arr_split(arr, chunk_size):
    chunked_list = list()
    for i in range(0, len(arr), chunk_size):
        chunked_list.append(arr[i:i+chunk_size])
    return chunked_list
